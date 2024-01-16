import { call, put, select, take } from 'redux-saga/effects';
import { safeGet, safeSet, updateOrPrepend } from '../../shared/js/object';
import { uniqBy } from '../../shared/js/uniq';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import {
  createDataSelectors,
  createGeneralStore,
  createRequest,
  defaultId,
  mergeReducers,
  mergeSagas,
  updateStandaloneItemAndItems,
} from '../../shared/react/store/storeHelpers';
import { fileDomain } from '../file/fileStore';
import { groupActions } from '../group/groupStore';
import { noteDomain } from '../note/noteStore';
import {
  attachFilesToPost,
  createPost,
  deleteFileAndCombineNotes,
  deletePost,
  fetchPost,
  fetchPosts,
  getCachedPost,
  getCachedPosts,
  getPostsCacheKey,
  updatePost,
} from './filePostNetwork';

export const filePostDomain = 'filePost';

const dataSelectors = createDataSelectors(filePostDomain);
const getPostsCacheKeyFromStore = state =>
  safeGet(state, [filePostDomain, defaultId, 'data', 'postsCacheKey']);

const { actions, selectors, reducer, saga } = createGeneralStore(filePostDomain, {
  preFetchItems: function* (payload) {
    const cacheKey = yield select(getPostsCacheKeyFromStore);
    const newCacheKey = getPostsCacheKey(payload);
    if (!payload?.force && cacheKey === newCacheKey) {
      return { continueCall: false };
    }

    const cachedPosts = yield call(getCachedPosts, payload);
    if (cachedPosts?.length) {
      yield put(actions.fetchItems.succeeded.action({ data: { items: cachedPosts }, payload }));
    }

    return { continueCall: true };
  },
  fetchItems: function* ({ startKey, groupId, startTime, endTime }) {
    const result = yield call(fetchPosts, { startKey, groupId, startTime, endTime });
    return result;
  },
  onFetchItemsSucceeded: (state, { payload = {} }) => {
    const newState = safeSet(
      state,
      [defaultId, 'data', 'postsCacheKey'],
      getPostsCacheKey(payload)
    );
    return newState;
  },
  preFetchItem: function* ({ itemId }) {
    const cachedPost = yield call(getCachedPost, itemId);
    if (cachedPost) {
      yield put(actions.fetchItem.succeeded.action({ data: cachedPost, payload: { itemId } }));
    }

    return { continueCall: true };
  },
  fetchItem: async ({ itemId }) => {
    return fetchPost(itemId);
  },
  createItem: function* ({ date, note, groups, onSucceeded }) {
    const result = yield call(createPost, { date, note, groups });

    if (result.data) {
      onSucceeded(result.data);
    }

    return result;
  },
  preUpdateItem: function* ({ itemId, note }) {
    let post = yield select(dataSelectors.getStandaloneItem);
    if (!post || post.sortKey !== itemId) {
      yield put({ type: `${filePostDomain}/fetchItem/REQUESTED`, payload: { itemId } });
      yield take(`${filePostDomain}/fetchItem/SUCCEEDED`);
      post = yield select(dataSelectors.getStandaloneItem);
    }

    return { continueCall: !!post && post.note !== note, result: post };
  },
  updateItem: function* ({ itemId, note }, post) {
    const result = yield call(updatePost, itemId, { note }, post.decryptedPassword);
    if (result.data) {
      yield put(sharedActionCreators.setToast('Post is encrypted and saved in server.'));
    }

    return result;
  },
  deleteItem: async ({ itemId, onSucceeded }) => {
    const result = await deletePost(itemId);
    if (onSucceeded && result.data) {
      onSucceeded(itemId);
    }

    return result;
  },
});

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
    const newState = safeSet(state, [defaultId, 'data', 'item'], data);
    return newState;
  },
});

const {
  actions: attachFilesToPostActions,
  selectors: attachFilesToPostSelectors,
  reducer: attachFilesToPostReducer,
  saga: attachFilesToPostSaga,
} = createRequest(filePostDomain, 'attachFilesToPost', {
  request: function* ({ postId, postDate, items, startItemId, groups, onUpdate, onSucceeded }) {
    const result = yield call(
      attachFilesToPost,
      postId,
      postDate,
      items,
      startItemId,
      groups,
      onUpdate
    );
    if (result.data) {
      yield put(sharedActionCreators.setToast('Encrypted and saved in server.'));
      if (onSucceeded) {
        onSucceeded(result.data);
      }
    }
    return result;
  },
  onReducerSucceeded: (state, { data }) => {
    let newState = safeSet(state, [defaultId, 'data', 'item'], data);
    newState = updateOrPrepend(newState, [defaultId, 'data', 'items'], data.sortKey, data);
    return newState;
  },
});

const createGroupItemSucceededActionType = groupActions.createGroupItemSucceeded().type;
const deleteGroupItemSucceededActionType = groupActions.deleteGroupItemSucceeded().type;

const customReducer = (state = {}, action) => {
  switch (action.type) {
    case `${noteDomain}/createItem/SUCCEEDED`: {
      const {
        payload: {
          data: { post },
        },
      } = action;
      if (post) {
        return updateStandaloneItemAndItems(state, post);
      }
      return state;
    }

    case `${fileDomain}/deleteItem/SUCCEEDED`:
    case `${noteDomain}/deleteItem/SUCCEEDED`: {
      const {
        payload: { data },
      } = action;
      return updateStandaloneItemAndItems(state, data);
    }

    case createGroupItemSucceededActionType: {
      const post = safeGet(state, [defaultId, 'data', 'item']);
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
      const post = safeGet(state, [defaultId, 'data', 'item']);
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

export const filePostActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  updateRequested: actions.updateItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
  deleteFileAndCombineNotesRequested: deleteFileAndCombineNotesActions.requested.action,
  attachFilesToPostRequested: attachFilesToPostActions.requested.action,
};

export const filePostSelectors = {
  ...selectors,
  data: {
    ...dataSelectors,
    getPostsCacheKey: getPostsCacheKeyFromStore,
  },
  deleteFileAndCombineNotes: deleteFileAndCombineNotesSelectors,
  attachFilesToPost: attachFilesToPostSelectors,
};

export const filePostExtraSelectors = {
  deleteFileAndCombineNotes: deleteFileAndCombineNotesSelectors,
  attachFilesToPost: attachFilesToPostSelectors,
};

export const filePostReducer = mergeReducers([
  reducer,
  customReducer,
  deleteFileAndCombineNotesReducer,
  attachFilesToPostReducer,
]);

export const filePostSagas = mergeSagas([
  saga,
  deleteFileAndCombineNotesSaga,
  attachFilesToPostSaga,
]);
