import { group37Prefix } from '../../shared/js/apps';
import { createGroupStore } from '../../shared/react/store/group/groupStore';

export const groupDomain = 'file37_groups';

const { actions, selectors, reducer, saga } = createGroupStore(groupDomain, group37Prefix.file37);

export const groupActions = actions;
export const groupSelectors = selectors;
export const groupReducer = reducer;
export const groupSaga = saga;
