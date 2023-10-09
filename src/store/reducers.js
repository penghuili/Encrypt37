import { combineReducers } from 'redux';

import { filePostDomain } from '../shared/react/store/file/filePostStore';
import { fileDomain, fileReducer } from '../shared/react/store/file/fileStore';
import { sharedReducer } from '../shared/react/store/sharedReducer';
import { filePostReducer } from './filePost/filePostStore';
import { groupDomain, groupReducer } from './group/groupStore';
import { noteDomain, noteReducer } from './note/noteStore';

export const reducers = combineReducers({
  shared: sharedReducer,
  [fileDomain]: fileReducer,
  [filePostDomain]: filePostReducer,
  [groupDomain]: groupReducer,
  [noteDomain]: noteReducer,
});
