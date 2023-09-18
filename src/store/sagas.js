import { all } from 'redux-saga/effects';

import { fileSagas } from '../shared/react/store/file/fileStore';
import { sharedSagas } from '../shared/react/store/sharedSaga';
import { groupSaga } from './group/groupStore';
import { filePostSagas } from '../shared/react/store/file/filePostStore';

export function* sagas() {
  yield all([sharedSagas(), fileSagas(), filePostSagas(), groupSaga()]);
}
