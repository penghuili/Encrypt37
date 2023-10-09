import { call, put } from 'redux-saga/effects';

import asyncForEach from '../../shared/js/asyncForEach';
import { safeGet, safeSet } from '../../shared/js/object';
import { uniqBy } from '../../shared/js/uniq';
import { uploadFile } from '../../shared/react/store/file/fileNetwork';
import { removeFileFromPost, updatePost } from '../../shared/react/store/file/filePostNetwork';
import {
  filePostDomain,
  filePostReducer as sharedFilePostReducer,
  filePostSagas as sharedFilePostSagas,
} from '../../shared/react/store/file/filePostStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import {
  createRequest,
  defaultId,
  mergeReducers,
  mergeSagas,
  updateStandaloneItemAndItems,
} from '../../shared/react/store/storeHelpers';
import { groupActions } from '../group/groupStore';
import { createNote, updateNote } from '../note/noteNetwork';

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

export async function attachFilesToPost(postId, items, startItemId) {
  try {
    let currentItemId = startItemId;
    let post;
    await asyncForEach(items, async item => {
      if (item.type === 'file') {
        const result = await uploadFile(item.file, '', postId, currentItemId);
        if (result.data) {
          currentItemId = result.data.file.sortKey;
          post = result.data.post;
        }
      } else if (item.type === 'note') {
        const result = await createNote({
          postId,
          startItemId: currentItemId,
          note: item.note,
          date: Date.now(),
        });
        if (result.data) {
          currentItemId = result.data.note.sortKey;
          post = result.data.post;
        }
      }
    });

    return { data: post, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

const {
  actions: deleteFileAndCombineNotesActions,
  selectors: deleteFileAndCombineNotesSelectors,
  reducer: deleteFileAndCombineNotesReducer,
  saga: deleteFileAndCombineNotesSaga,
} = createRequest(filePostDomain, 'deleteFileAndCombineNotes', {
  request: function* ({ postId, fileId, previousItem, nextItem, onSucceeded }) {
    const result = yield call(deleteFileAndCombineNotes, postId, fileId, previousItem, nextItem);
    if (result.data) {
      yield put(sharedActionCreators.setToast('Deleted.'));

      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }
    return result;
  },
  onReducerSucceeded: (state, { data }) => {
    console.log('data', data);
    const newState = safeSet(state, ['data', defaultId, 'item'], data);
    return newState;
  },
});

const {
  actions: attachFilesToPostActions,
  selectors: attachFilesToPostSelectors,
  reducer: attachFilesToPostReducer,
  saga: attachFilesToPostSaga,
} = createRequest(filePostDomain, 'attachFilesToPost', {
  request: function* ({ postId, items, startItemId, onSucceeded }) {
    const result = yield call(attachFilesToPost, postId, items, startItemId);
    if (result.data) {
      yield put(sharedActionCreators.setToast('Your files are encrypted and saved in server.'));
      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }
    return result;
  },
  onReducerSucceeded: (state, { data }) => {
    const newState = safeSet(state, ['data', defaultId, 'item'], data);
    return newState;
  },
});

const createGroupItemSucceededActionType = groupActions.createGroupItemSucceeded().type;
const deleteGroupItemSucceededActionType = groupActions.deleteGroupItemSucceeded().type;

const customReducer = (state = {}, action) => {
  switch (action.type) {
    case createGroupItemSucceededActionType: {
      const post = safeGet(state, ['data', defaultId, 'item']);
      if (!post) {
        return state;
      }

      const updatedPost = {
        ...post,
        groups: uniqBy(
          [
            ...(post.groups || []),
            { id: action.payload.data.item.id, itemId: action.payload.data.item.sortKey },
          ],
          'id'
        ),
      };
      const updatedState = updateStandaloneItemAndItems(state, updatedPost);
      return updatedState;
    }

    case deleteGroupItemSucceededActionType: {
      const post = safeGet(state, ['data', defaultId, 'item']);
      if (!post) {
        return state;
      }

      const updatedFile = {
        ...post,
        groups: (post.groups || []).filter(group => group.id !== action.payload.data.item.id),
      };
      const updatedState = updateStandaloneItemAndItems(state, updatedFile);
      return updatedState;
    }

    default:
      return state;
  }
};

export const filePostExtraActions = {
  deleteFileAndCombineNotesRequested: deleteFileAndCombineNotesActions.requested.action,
  attachFilesToPostRequested: attachFilesToPostActions.requested.action,
};

export const filePostExtraSelectors = {
  deleteFileAndCombineNotes: deleteFileAndCombineNotesSelectors,
  attachFilesToPost: attachFilesToPostSelectors,
};

export const filePostReducer = mergeReducers([
  customReducer,
  sharedFilePostReducer,
  deleteFileAndCombineNotesReducer,
  attachFilesToPostReducer,
]);

export const filePostSagas = mergeSagas([
  deleteFileAndCombineNotesSaga,
  attachFilesToPostSaga,
  sharedFilePostSagas,
]);
