import { combineReducers } from 'redux';

import { fileDomain } from '../shared/react/store/file/fileStore';
import { sharedReducer } from '../shared/react/store/sharedReducer';
import { fileReducer } from './file/fileStore';
import { groupDomain, groupReducer } from './group/groupStore';

export const reducers = combineReducers({
  shared: sharedReducer,
  [fileDomain]: fileReducer,
  [groupDomain]: groupReducer,
});
