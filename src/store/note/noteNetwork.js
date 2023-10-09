import apps from '../../shared/js/apps';
import {
  decryptMessage,
  decryptMessageSymmetric,
  encryptMessage,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import generatePassword from '../../shared/js/generatePassword';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/js/LocalStorage';
import HTTP from '../../shared/react/HTTP';
import { addFilesToPost } from '../../shared/react/store/file/filePostNetwork';

export async function fetchNote(noteId) {
  try {
    const item = await HTTP.get(apps.note37.name, `/v1/notes/${noteId}`);

    const decrypted = await decryptNoteContent(item);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNote({ postId, startItemId, note, date }) {
  try {
    const password = generatePassword(20, true);
    const { note: encryptedNote } = await encryptNoteContent({ note }, password);

    const encryptedPassword = await encryptMessage(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const data = await HTTP.post(apps.note37.name, `/v1/notes`, {
      password: encryptedPassword,
      note: encryptedNote,
      date,
    });

    const decrypted = await decryptNoteContent(data);

    let post = null;
    if (postId) {
      const { data } = await addFilesToPost(postId, [decrypted.sortKey], startItemId);
      post = data;
    }

    return { data: { note: decrypted, post }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateNote(noteId, { note }, decryptedPassword) {
  try {
    const { note: encryptedNote } = await encryptNoteContent({ note }, decryptedPassword);

    const data = await HTTP.put(apps.note37.name, `/v1/notes/${noteId}`, {
      note: encryptedNote,
    });

    const decrypted = await decryptNoteContent(data);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteNote(noteId) {
  try {
    const data = await HTTP.delete(apps.note37.name, `/v1/notes/${noteId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptNoteContent(data, decryptedPassword) {
  const { note } = data;

  const encryptedNote = note ? await encryptMessageSymmetric(decryptedPassword, note) : note;

  return {
    ...data,
    note: encryptedNote,
  };
}

async function decryptNoteContent(data) {
  const decryptedPassword = await decryptMessage(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    data.password
  );

  const decryptedNote = data.note
    ? await decryptMessageSymmetric(decryptedPassword, data.note)
    : null;

  return {
    ...data,
    note: decryptedNote,
    decryptedPassword,
  };
}