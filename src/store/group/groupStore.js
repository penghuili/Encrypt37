import { createGroupStore } from '../../shared/react/store/group/groupStore';

export const groupDomain = 'file37_groups';

const { actions, selectors, reducer, saga } = createGroupStore(groupDomain);

export const groupActions = actions;
export const groupSelectors = selectors;
export const groupReducer = reducer;
export const groupSaga = saga;
