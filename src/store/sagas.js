import { all } from 'redux-saga/effects';
import { sharedSagas } from '../shared/react/store/sharedSaga';
import { fileSagas } from './file/fileStore';
import { filePostSagas } from './filePost/filePostStore';
import { groupSaga } from './group/groupStore';
import { noteSagas } from './note/noteStore';

export function* sagas() {
  yield all([sharedSagas(), fileSagas(), filePostSagas(), groupSaga(), noteSagas()]);
}
