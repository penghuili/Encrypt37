import { combineReducers } from 'redux';

import { fileDomain, fileReducer } from '../shared/react/store/file/fileStore';
import { sharedReducer } from '../shared/react/store/sharedReducer';

export const reducers = combineReducers({
  shared: sharedReducer,
  [fileDomain]: fileReducer,
});
