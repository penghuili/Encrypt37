import { idbStorage } from '../../lib/indexDB';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/js/LocalStorage';
import { apps } from '../../shared/js/apps';
import { asyncForAll } from '../../shared/js/asyncForAll';
import {
  decryptMessage,
  decryptMessageSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import HTTP from '../../shared/react/HTTP';
import { objectToQueryString } from '../../shared/react/routeHelpers';
import { decryptFileContent, uploadFile } from '../file/fileNetwork';
import { createNote, updateNote } from '../note/noteNetwork';

export function getPostsCacheKey({ groupId, startTime, endTime }) {
  return `posts-cache-${groupId || 'groupId'}-${startTime || 'startTime'}-${endTime || 'endTime'}`;
}

function getPostCacheKey(postId) {
  return `post-cache-${postId}`;
}

async function cachePosts(posts, { startKey, groupId, startTime, endTime }) {
  if (startKey) {
    return;
  }

  const key = getPostsCacheKey({ groupId, startTime, endTime });
  await idbStorage.setItem(key, posts);
}

export async function getCachedPosts({ startKey, groupId, startTime, endTime }) {
  if (startKey) {
    return [];
  }

  const key = getPostsCacheKey({ groupId, startTime, endTime });
  const posts = await idbStorage.getItem(key);
  return posts;
}

async function cachePost(post) {
  if (!post) {
    return;
  }

  const key = getPostCacheKey(post.sortKey);
  await idbStorage.setItem(key, post);
}

export async function getCachedPost(postId) {
  if (!postId) {
    return null;
  }

  const key = getPostCacheKey(postId);
  const post = await idbStorage.getItem(key);
  return post;
}

async function deleteCachedPost(postId) {
  if (!postId) {
    return;
  }

  const key = getPostCacheKey(postId);
  await idbStorage.removeItem(key);
}

export async function fetchPosts({ startKey, groupId, startTime, endTime }) {
  try {
    const queryString = objectToQueryString({
      startKey,
      groupId,
      startTime,
      endTime,
    });

    const {
      items,
      startKey: newStartKey,
      limit,
    } = await HTTP.get(apps.file37.name, `/v1/posts${queryString ? `?${queryString}` : ''}`);

    const decryptedItems = (
      await asyncForAll(items, async item => {
        try {
          const decryptedItem = await decryptPostContent(item);
          return decryptedItem;
        } catch (e) {
          console.error(e, item);
          return null;
        }
      })
    ).filter(item => item);

    await cachePosts(decryptedItems, { startKey, groupId, startTime, endTime });

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

export async function fetchPost(postId) {
  try {
    const post = await HTTP.get(apps.file37.name, `/v1/posts/${postId}`);

    const decrypted = await decryptPostContent(post);

    await cachePost(decrypted);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createPost({ date, note, files, groups }) {
  try {
    const password = generatePassword(20, true);
    const encryptedNote = note ? await encryptMessageSymmetric(password, note) : undefined;
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const post = await HTTP.post(apps.file37.name, `/v1/posts`, {
      password: encryptedPassword,
      date,
      note: encryptedNote,
      files,
      groups,
    });

    const decrypted = await decryptPostContent(post);

    await cachePost(decrypted);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updatePost(postId, { note }, decryptedPassword) {
  try {
    const encryptedNote = note ? await encryptMessageSymmetric(decryptedPassword, note) : undefined;
    const post = await HTTP.put(apps.file37.name, `/v1/posts/${postId}`, { note: encryptedNote });

    const decrypted = await decryptPostContent(post);

    await cachePost(decrypted);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function addFilesToPost(postId, files, startItemId) {
  try {
    const post = await HTTP.put(apps.file37.name, `/v1/posts/${postId}/files`, {
      files,
      startFile: startItemId,
    });

    const decrypted = await decryptPostContent(post);

    await cachePost(decrypted);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function removeFileFromPost(postId, fileId) {
  try {
    const post = await HTTP.delete(apps.file37.name, `/v1/posts/${postId}/files/${fileId}`);

    await idbStorage.removeItem(fileId);

    const decrypted = await decryptPostContent(post);

    await cachePost(decrypted);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deletePost(postId) {
  try {
    await HTTP.delete(apps.file37.name, `/v1/posts/${postId}`);

    await deleteCachedPost(postId);

    return { data: { id: postId }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteFileAndCombineNotes(postId, fileId, previousItem, nextItem) {
  try {
    let result = await removeFileFromPost(postId, fileId);
    if (result.error) {
      return result;
    }

    if (previousItem) {
      if (previousItem.id.startsWith('note37')) {
        await updateNote(
          previousItem.id,
          { note: previousItem.note },
          previousItem.decryptedPassword
        );
      } else {
        await updatePost(postId, { note: previousItem.note }, previousItem.decryptedPassword);
      }
    }

    if (nextItem) {
      result = await removeFileFromPost(postId, nextItem.id);
    }

    return result;
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function attachFilesToPost(
  postId,
  postDate,
  items,
  startItemId,
  groups = [],
  onUpdate = () => {}
) {
  try {
    let post;
    let innerPostId = postId;
    let innerItems = items;
    let currentItemId = startItemId;

    if (!postId) {
      const result = await createPost({
        date: postDate ? postDate.getTime() : Date.now(),
        note: items[0].note,
        groups,
        files: [],
      });
      if (result.data) {
        innerPostId = result.data.sortKey;
        post = result.data;
        innerItems = items.slice(1);
        currentItemId = post.sortKey;

        onUpdate(items[0]);
      } else {
        return result;
      }
    }

    const sortKeys = await asyncForAll(innerItems, async item => {
      if (item.type === 'file') {
        const result = await uploadFile(item.file, '');
        if (result.data) {
          onUpdate(item);
        }

        return result.data?.sortKey;
      } else if (item.type === 'note') {
        const result = await createNote({
          postId: innerPostId,
          startItemId: currentItemId,
          note: item.note,
          date: Date.now(),
          updatePost: false,
        });
        if (result.data) {
          onUpdate(item);
        }

        return result.data?.note?.sortKey;
      }

      return null;
    });
    const validKeys = sortKeys.filter(k => !!k);
    if (validKeys.length) {
      const { data } = await addFilesToPost(innerPostId, validKeys, currentItemId);
      if (data) {
        innerPostId = data.sortKey;
        post = data;
        currentItemId = post.sortKey;
      }
    }

    return { data: post, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

async function decryptPostContent(post) {
  const decryptedPostPassword = await decryptMessage(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    post.password
  );

  const decryptedNote = post.note
    ? await decryptMessageSymmetric(decryptedPostPassword, post.note)
    : null;

  const items = await asyncForAll(post.items, async item => {
    if (item.type === 'note') {
      const note = item.note;
      const decryptedNotePassword = await decryptMessage(
        LocalStorage.get(sharedLocalStorageKeys.privateKey),
        note.password
      );
      const decryptedNote = note.note
        ? await decryptMessageSymmetric(decryptedNotePassword, note.note)
        : null;

      return {
        ...item,
        note: {
          ...note,
          note: decryptedNote,
          decryptedPassword: decryptedNotePassword,
        },
      };
    } else {
      if (item.fileMeta) {
        const decryptedFileMeta = await decryptFileContent(item.fileMeta);
        return {
          ...item,
          fileMeta: decryptedFileMeta,
        };
      }
      return item;
    }
  });

  return { ...post, note: decryptedNote, decryptedPassword: decryptedPostPassword, items };
}
