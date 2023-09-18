import { safeGet } from '../../shared/js/object';
import { uniqBy } from '../../shared/js/uniq';
import {
  filePostReducer as sharedFilePostReducer,
} from '../../shared/react/store/file/filePostStore';
import {
  defaultId,
  mergeReducers,
  updateStandaloneItemAndItems,
} from '../../shared/react/store/storeHelpers';
import { groupActions } from '../group/groupStore';

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

export const filePostReducer = mergeReducers([customReducer, sharedFilePostReducer]);
