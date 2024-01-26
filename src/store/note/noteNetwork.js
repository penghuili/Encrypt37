import { LocalStorage, sharedLocalStorageKeys } from '../../shared/js/LocalStorage';
import { apps } from '../../shared/js/apps';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import HTTP from '../../shared/react/HTTP';
import { addFilesToPost } from '../filePost/filePostNetwork';

export async function fetchNote(noteId) {
  try {
    const item = await HTTP.get(apps.Note37.name, `/v1/notes/${noteId}`);

    const decrypted = await decryptNoteContent(item);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNote({ postId, startItemId, note, date, updatePost }) {
  try {
    const password = generatePassword(20, true);
    const { note: encryptedNote } = await encryptNoteContent({ note }, password);

    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const data = await HTTP.post(apps.Note37.name, `/v1/notes`, {
      password: encryptedPassword,
      note: encryptedNote,
      date,
    });

    const decrypted = await decryptNoteContent(data);

    let post = null;
    if (updatePost && postId) {
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

    const data = await HTTP.put(apps.Note37.name, `/v1/notes/${noteId}`, {
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
    const data = await HTTP.delete(apps.Note37.name, `/v1/notes/${noteId}`);

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
  const decryptedPassword = await decryptMessageAsymmetric(
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
