import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { SAGA } from './sagaWrapper'

// Wrap all sagas in a container
export default function* rootSaga() {
  yield all([
    SAGA('GET_JOB_LIST', takeLatest, 'list', 'job/jobs/', 'application/json')(),
    SAGA('PATCH_JOB', takeLatest, 'patch', 'job/jobs/', 'application/json')(),
    SAGA('GET_TECHSTACK_LIST', takeLatest, 'list', 'job/techs/', 'application/json')(),
  ])
}
