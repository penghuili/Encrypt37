import { safeGet, safeSet, updateBySortKey } from '../../shared/js/object';
import { uniqBy } from '../../shared/js/uniq';
import {
  regroupFiles,
  fileReducer as sharedFileReducer,
} from '../../shared/react/store/file/fileStore';
import { defaultId, mergeReducers } from '../../shared/react/store/storeHelpers';
import { groupActions } from '../group/groupStore';

const createGroupItemSucceededActionType = groupActions.createGroupItemSucceeded().type;
const deleteGroupItemSucceededActionType = groupActions.deleteGroupItemSucceeded().type;

function updateStandaloneItemAndItems(state, item) {
  const updatedItem = safeSet(state, ['data', defaultId, 'item'], item);
  const updatedItems = updateBySortKey(
    updatedItem,
    ['data', defaultId, 'items'],
    item.sortKey,
    item
  );
  return updatedItems;
}

const customReducer = (state = {}, action) => {
  switch (action.type) {
    case createGroupItemSucceededActionType: {
      const file = safeGet(state, ['data', defaultId, 'item']);
      if (!file) {
        return state;
      }

      const updatedFile = {
        ...file,
        groups: uniqBy(
          [
            ...(file.groups || []),
            { id: action.payload.data.id, itemId: action.payload.data.sortKey },
          ],
          'id'
        ),
      };
      const updatedState = updateStandaloneItemAndItems(state, updatedFile);
      return regroupFiles(updatedState);
    }

    case deleteGroupItemSucceededActionType: {
      const file = safeGet(state, ['data', defaultId, 'item']);
      if (!file) {
        return state;
      }

      const updatedFile = {
        ...file,
        groups: (file.groups || []).filter(group => group.id !== action.payload.data.id),
      };
      const updatedState = updateStandaloneItemAndItems(state, updatedFile);
      return regroupFiles(updatedState);
    }

    default:
      return state;
  }
};

export const fileReducer = mergeReducers([customReducer, sharedFileReducer]);
