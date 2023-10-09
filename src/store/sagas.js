import { all } from 'redux-saga/effects';

import { fileSagas } from '../shared/react/store/file/fileStore';
import { sharedSagas } from '../shared/react/store/sharedSaga';
import { filePostSagas } from './filePost/filePostStore';
import { groupSaga } from './group/groupStore';
import { noteSagas } from './note/noteStore';

export function* sagas() {
  yield all([sharedSagas(), fileSagas(), filePostSagas(), groupSaga(), noteSagas()]);
}
