import { all } from 'redux-saga/effects';

import { fileSagas } from '../shared/react/store/file/fileStore';
import { sharedSagas } from '../shared/react/store/sharedSaga';

export function* sagas() {
  yield all([sharedSagas(), fileSagas()]);
}
