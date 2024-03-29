import { combineReducers } from 'redux';
import { sharedReducer } from '../shared/react/store/sharedReducer';
import { fileDomain, fileReducer } from './file/fileStore';
import { filePostDomain, filePostReducer } from './filePost/filePostStore';
import { groupDomain, groupReducer } from './group/groupStore';
import { noteDomain, noteReducer } from './note/noteStore';

export const reducers = combineReducers({
  shared: sharedReducer,
  [fileDomain]: fileReducer,
  [filePostDomain]: filePostReducer,
  [groupDomain]: groupReducer,
  [noteDomain]: noteReducer,
});
