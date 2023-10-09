import { call, put, select, take } from 'redux-saga/effects';

import { safeGet, safeSet } from '../../shared/js/object';
import { removeFileFromPost } from '../../shared/react/store/file/filePostNetwork';
import {
  createDataSelectors,
  createGeneralStore,
  defaultId,
} from '../../shared/react/store/storeHelpers';
import { createNote, fetchNote, updateNote } from './noteNetwork';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';

export const noteDomain = 'note';

const dataSelectors = {
  ...createDataSelectors(noteDomain),
  getItem: (state, fileId) => safeGet(state, [noteDomain, 'data', defaultId, 'notes', fileId]),
};

const { actions, selectors, reducer, saga } = createGeneralStore(noteDomain, {
  preFetchItem: function* ({ itemId }) {
    const item = yield select(dataSelectors.getItem, itemId);
    if (item) {
      return { continueCall: false };
    }
    return { continueCall: true };
  },
  fetchItem: async ({ itemId, onSucceeded }) => {
    const result = fetchNote(itemId);

    if (onSucceeded && result.data) {
      onSucceeded(result.data);
    }

    return result;
  },
  onFetchItemSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', defaultId, 'notes', payload.itemId], data);
    return newState;
  },
  createItem: function* ({ postId, startItemId, note, date, onSucceeded }) {
    const result = yield call(createNote, { note, date, postId, startItemId });

    if (result.data) {
      yield put(sharedActionCreators.setToast('Note is encrypted and saved in server.'));
      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }

    return result;
  },
  onCreateItemSucceeded: (state, { payload, data: { note } }) => {
    const newState = safeSet(state, ['data', defaultId, 'notes', payload.itemId], note);
    return newState;
  },
  preUpdateItem: function* ({ itemId }) {
    let item = yield select(dataSelectors.getItem, itemId);
    if (!item) {
      yield put({ type: `${noteDomain}/fetchItem/REQUESTED`, payload: { itemId } });
      yield take(`${noteDomain}/fetchItem/SUCCEEDED`);
      item = yield select(dataSelectors.getItem, itemId);
    }

    return { continueCall: true, result: item };
  },
  updateItem: function* ({ itemId, note, onSucceeded }, item) {
    const result = yield call(updateNote, itemId, { note }, item.decryptedPassword);

    if (result.data) {
      yield put(sharedActionCreators.setToast('Note is encrypted and saved in server.'));
      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }

    return result;
  },
  onUpdateItemSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', defaultId, 'notes', payload.itemId], data);
    return newState;
  },
  deleteItem: async ({ itemId, noteId, onSucceeded }) => {
    const result = await removeFileFromPost(itemId, [noteId]);
    if (onSucceeded && result.data) {
      onSucceeded(itemId);
    }

    return result;
  },
  onDeleteItemSucceeded: (state, { payload }) => {
    const newState = safeSet(state, ['data', defaultId, 'fileMetas', payload.itemId], null);
    return newState;
  },
});

export const noteActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  updateRequested: actions.updateItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
};

export const noteSelectors = {
  ...selectors,
  data: dataSelectors,
};

export const noteReducer = reducer;

export const noteSagas = saga;
