import { saveAs } from 'file-saver';
import { idbStorage } from '../../lib/indexDB';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/js/LocalStorage';
import { apps } from '../../shared/js/apps';
import { asyncForAll } from '../../shared/js/asyncForAll';
import {
  CHUNK_SIZE,
  decryptFileSymmetric,
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptFileSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import HTTP from '../../shared/react/HTTP';
import {
  blobToUnit8Array,
  fetchResponseToUnit8Array,
  generateImageThumbnail,
  inputFileToUnit8Array,
  isImage,
} from '../../shared/react/file';

async function fetchUrlsForUpload(count) {
  try {
    const { urls, thumbnailUrl, fileId } = await HTTP.get(
      apps.Encrypt37.name,
      `/v1/upload-url?count=${count}`
    );

    return { data: { urls, thumbnailUrl, fileId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function fetchUrlsForDownload(fileId) {
  try {
    const { urls, thumbnailUrl } = await HTTP.get(apps.Encrypt37.name, `/v1/download-url/${fileId}`);

    return { data: { urls, thumbnailUrl }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchFiles({ startKey, startTime, endTime }) {
  try {
    const startKeyQuery = startKey ? `startKey=${startKey}` : '';
    const startTimeQuery = startTime ? `startTime=${startTime}` : '';
    const endTimeQuery = endTime ? `endTime=${endTime}` : '';
    const queryString = [startKeyQuery, startTimeQuery, endTimeQuery].filter(q => q).join('&');
    const {
      items,
      startKey: newStartKey,
      limit,
    } = await HTTP.get(apps.Encrypt37.name, `/v1/files${queryString ? `?${queryString}` : ''}`);

    const decryptedItems = await asyncForAll(items, async item => {
      const decryptedItem = await decryptFileContent(item);
      return decryptedItem;
    });

    return {
      data: {
        items: decryptedItems,
        startKey: newStartKey,
        hasMore: decryptedItems.length >= limit,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchFile(fileId) {
  try {
    const file = await HTTP.get(apps.Encrypt37.name, `/v1/files/${fileId}`);

    const decrypted = await decryptFileContent(file);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateFile(fileId, { note }, decryptedPassword) {
  try {
    const encryptedNote = note ? await encryptMessageSymmetric(decryptedPassword, note) : undefined;
    const file = await HTTP.put(apps.Encrypt37.name, `/v1/files/${fileId}`, { note: encryptedNote });

    const decrypted = await decryptFileContent(file);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function uploadFile(file, note) {
  try {
    const count = Math.ceil(file.size / CHUNK_SIZE);
    const {
      data: { urls, thumbnailUrl, fileId },
    } = await fetchUrlsForUpload(count);

    const password = generatePassword(20, true);

    await asyncForAll(urls, async (url, index) => {
      const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
      const unit8Array = await inputFileToUnit8Array(chunk);
      const encryptedChunk = await encryptFileSymmetric(password, unit8Array);

      await fetch(url, {
        method: 'PUT',
        body: encryptedChunk,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    });

    let thumbnail = false;
    let thumbnailBlob;
    if (isImage(file.type)) {
      thumbnailBlob = await generateImageThumbnail(file);
      if (thumbnailBlob) {
        const thumbnailUnit8Array = await blobToUnit8Array(thumbnailBlob);
        const encryptedThumbnail = await encryptFileSymmetric(password, thumbnailUnit8Array);

        await fetch(thumbnailUrl, {
          method: 'PUT',
          body: encryptedThumbnail,
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });
        thumbnail = true;
      }
    }

    const encryptedFileName = await encryptMessageSymmetric(password, file.name);
    const encryptedNote = note ? await encryptMessageSymmetric(password, note) : undefined;
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const data = await HTTP.post(apps.Encrypt37.name, `/v1/files`, {
      fileId,
      password: encryptedPassword,
      fileName: encryptedFileName,
      count,
      thumbnail,
      mimeType: file.type,
      size: file.size,
      lastModified: file.lastModified ? new Date(file.lastModified).getTime() : undefined,
      note: encryptedNote,
    });
    const decrypted = await decryptFileContent(data);

    if (thumbnailBlob) {
      await cacheThumbnail(fileId, thumbnailBlob);
    }

    return { data: decrypted, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

async function cacheThumbnail(fileId, blob) {
  try {
    await idbStorage.setItem(fileId, blob);

    const keys = await idbStorage.getKeys();
    const filterKeys = (keys || []).filter(k => k.startsWith('file37'));

    if (filterKeys.length > 500) {
      const sorted = filterKeys.sort();
      const toDelete = sorted.slice(0, sorted.length - 500);
      await idbStorage.removeItems(toDelete);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function downloadThumbnail(fileId, fileMeta) {
  try {
    const {
      data: { thumbnailUrl },
    } = await fetchUrlsForDownload(fileId);
    if (!thumbnailUrl) {
      return { data: null, error: new Error('Thumbnail not found') };
    }

    const response = await fetch(thumbnailUrl);
    const unit8Array = await fetchResponseToUnit8Array(response);

    const decryptedFile = await decryptFileSymmetric(fileMeta.decryptedPassword, unit8Array);

    const blob = new Blob([decryptedFile], { type: fileMeta.mimeType });

    await cacheThumbnail(fileId, blob);

    const objectUrl = URL.createObjectURL(blob);

    return { data: { url: objectUrl, fileName: fileMeta.fileName }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function downloadFile(fileId) {
  try {
    const {
      data: { urls },
    } = await fetchUrlsForDownload(fileId);

    const { data: fileMeta } = await fetchFile(fileId);
    const decryptedPassword = await decryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.privateKey),
      fileMeta.password
    );

    const decryptedChunks = await asyncForAll(urls, async url => {
      const response = await fetch(url);
      const unit8Array = await fetchResponseToUnit8Array(response);
      const decryptedChunk = await decryptFileSymmetric(decryptedPassword, unit8Array);
      return decryptedChunk;
    });
    const blob = new Blob(decryptedChunks, { type: fileMeta.mimeType });
    console.log(fileMeta.fileName);
    saveAs(blob, fileMeta.fileName);

    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function decryptFileContent(file) {
  const decryptedPassword = await decryptMessageAsymmetric(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    file.password
  );

  const decryptedFileName = await decryptMessageSymmetric(decryptedPassword, file.fileName);
  const decryptedNote = file.note
    ? await decryptMessageSymmetric(decryptedPassword, file.note)
    : null;

  return { ...file, fileName: decryptedFileName, note: decryptedNote, decryptedPassword };
}
