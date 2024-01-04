import { call, put, select } from 'redux-saga/effects';
import { idbStorage } from '../../lib/indexDB';
import { safeGet, safeSet } from '../../shared/js/object';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import {
  createDataSelectors,
  createGeneralStore,
  createRequest,
  defaultId,
  mergeReducers,
  mergeSagas,
} from '../../shared/react/store/storeHelpers';
import { removeFileFromPost } from '../filePost/filePostNetwork';
import { downloadFile, downloadThumbnail, fetchFile, fetchFiles } from './fileNetwork';

export const fileDomain = 'file';

const dataSelectors = {
  ...createDataSelectors(fileDomain),
  getItem: (state, fileId) => safeGet(state, [fileDomain, defaultId, 'data', 'fileMetas', fileId]),
};

const { actions, selectors, reducer, saga } = createGeneralStore(fileDomain, {
  preFetchItems: function* (payload) {
    const files = yield select(dataSelectors.getItems);
    if (!payload?.force && files.length) {
      return { continueCall: false };
    }
    return { continueCall: true };
  },
  fetchItems: async ({ startKey, startTime, endTime }) => {
    return fetchFiles({ startKey, startTime, endTime });
  },
  preFetchItem: function* ({ itemId }) {
    const file = yield select(dataSelectors.getItem, itemId);
    if (file) {
      return { continueCall: false };
    }
    return { continueCall: true };
  },
  fetchItem: async ({ itemId }) => {
    return fetchFile(itemId);
  },
  onFetchItemSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, [defaultId, 'data', 'fileMetas', payload.itemId], data);
    return newState;
  },
  deleteItem: async ({ itemId, fileId, onSucceeded }) => {
    const result = await removeFileFromPost(itemId, [fileId]);
    if (onSucceeded && result.data) {
      onSucceeded(itemId);
    }

    return result;
  },
  onDeleteItemSucceeded: (state, { payload }) => {
    const newState = safeSet(state, [defaultId, 'data', 'fileMetas', payload.itemId], null);
    return newState;
  },
});

const getRawFile = (state, fileId) => {
  return safeGet(state, [fileDomain, defaultId, 'data', 'rawFiles', fileId]);
};
const {
  actions: downloadFileActions,
  selectors: downloadFileSelectors,
  reducer: downloadFileReducer,
  saga: downloadFileSaga,
} = createRequest(fileDomain, 'downloadFile', {
  watchEvery: true,
  request: function* ({ fileId, onSucceeded }) {
    const result = yield call(downloadFile, fileId);
    if (result.data) {
      yield put(sharedActionCreators.setToast('Downloaded.'));
      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }

    return result;
  },
});

const getThumbnail = (state, fileId) => {
  return safeGet(state, [fileDomain, defaultId, 'data', 'thumbnails', fileId]);
};
const {
  actions: downloadThumbnailActions,
  selectors: downloadThumbnailSelectors,
  reducer: downloadThumbnailReducer,
  saga: downloadThumbnailSaga,
} = createRequest(fileDomain, 'downloadThumbnail', {
  watchEvery: true,

  preRequest: function* ({ fileId }) {
    let file = yield select(getThumbnail, fileId);
    if (!file) {
      const cachedFile = yield call(idbStorage.getItem, fileId);
      if (cachedFile) {
        const objectUrl = URL.createObjectURL(cachedFile);
        file = { url: objectUrl, fileName: cachedFile.name };
        yield put(downloadThumbnailActions.succeeded.action({ payload: { fileId }, data: file }));
      }
    }
    return { continueCall: !file };
  },
  request: async ({ fileId, fileMeta }) => {
    return downloadThumbnail(fileId, fileMeta);
  },
  onReducerSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, [defaultId, 'data', 'thumbnails', payload.fileId], data);
    return newState;
  },
});

export const fileActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  updateRequested: actions.updateItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
  downloadFileRequested: downloadFileActions.requested.action,
  downloadThumbnailRequested: downloadThumbnailActions.requested.action,
};

export const fileSelectors = {
  ...selectors,
  downloadFile: downloadFileSelectors,
  downloadThumbnail: downloadThumbnailSelectors,
  data: {
    ...dataSelectors,
    getItem: (state, fileId) =>
      safeGet(state, [fileDomain, defaultId, 'data', 'fileMetas', fileId]),
    getGroupItems: state => safeGet(state, [fileDomain, defaultId, 'data', `groupItems`]),
    getRawFile,
    getThumbnail,
  },
};

export const fileReducer = mergeReducers([reducer, downloadFileReducer, downloadThumbnailReducer]);

export const fileSagas = mergeSagas([saga, downloadFileSaga, downloadThumbnailSaga]);
