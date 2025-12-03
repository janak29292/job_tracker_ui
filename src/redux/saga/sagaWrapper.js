import { put, call } from 'redux-saga/effects'
import apiCaller from '../apiCaller'

export const SAGA = (SagaName, SagaTakeMethod, requestType, path, contentType, auth) => {
  return function* saga() {
    yield SagaTakeMethod(SagaName, function* (action) {
      yield put({ type: `${SagaName}_STARTED` })
      try {
        const DATA = yield call(apiCaller.bind(this, action.payload, path, requestType, contentType, auth, action.params, action.key));
        yield put({
          type: `${SagaName}_SUCCESS`,
          payload: { status: 'success', body: DATA.data, key: action.key}
        })
      } catch (error) {
        console.log(error)
        if (error.message === 'Network Error') {
          yield put({
            type: `${SagaName}_NET_FAILED`,
            payload: { status: 'failure', message: error.message, key: action.key}
          })
        } else {
          try {
            yield put({
            type: `${SagaName}_FAILED`,
            payload: { status: 'failure', message: error.response.data, key: action.key}
          })
          } catch (error) {
            yield put({
              type: `${SagaName}_FAILED`,
              payload: { status: 'failure', message: error.toString(), key: action.key}
            })
          }
        }
      }
    })
  }
}
