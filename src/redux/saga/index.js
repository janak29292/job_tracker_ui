import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { SAGA } from './sagaWrapper'

// Wrap all sagas in a container
export default function* rootSaga() {
  yield all([
    // Existing job tracker sagas
    SAGA('GET_JOB_LIST', takeLatest, 'list', 'job/jobs/', 'application/json')(),
    SAGA('PATCH_JOB', takeLatest, 'patch', 'job/jobs/', 'application/json')(),
    SAGA('GET_TECHSTACK_LIST', takeLatest, 'list', 'job/techs/', 'application/json')(),
    SAGA('GET_POSTING_LIST', takeLatest, 'list', 'job/postings/', 'application/json')(),
    SAGA('GET_DAILY_JOB_COUNT', takeLatest, 'list', 'job/jobs/daily-count/', 'application/json')(),

    // Analytics Module Sagas
    SAGA('GET_ANALYTICS_SUMMARY', takeLatest, 'list', 'job/jobs/summary/', 'application/json')(),
    SAGA('GET_CHANNEL_PERFORMANCE', takeLatest, 'list', 'job/jobs/channels/', 'application/json')(),
    SAGA('GET_TECH_DEMAND', takeLatest, 'list', 'job/jobs/tech-demand/', 'application/json')(),
    SAGA('GET_APPLICATION_VELOCITY', takeLatest, 'list', 'job/jobs/velocity/', 'application/json')(),
    SAGA('GET_GHOSTING_ANALYSIS', takeLatest, 'list', 'job/jobs/ghosting/', 'application/json')(),
    SAGA('GET_STATUS_TRENDS', takeLatest, 'list', 'job/jobs/status-trends/', 'application/json')(),

    // Tech Proficiency Tracker Sagas
    SAGA('GET_TECH_PROFICIENCY', takeLatest, 'list', 'user/tech-tracker/', 'application/json')(),
    SAGA('ADD_TECH', takeLatest, 'post', 'user/tech-tracker/', 'application/json')(),
    SAGA('UPDATE_TECH', takeLatest, 'put', 'user/tech-tracker/', 'application/json')(),
    SAGA('DELETE_TECH', takeLatest, 'delete', 'user/tech-tracker/', 'application/json')(),
    SAGA('COMPARE_TECH_WITH_JOB', takeLatest, 'post', 'user/tech-tracker/compare/', 'application/json')(),

    // DSA Module Sagas
    SAGA('GET_DSA_LIST', takeLatest, 'list', 'user/dsa/', 'application/json')(),
    SAGA('GET_DSA_CATEGORY', takeLatest, 'detail', 'user/dsa/', 'application/json')(),
    SAGA('ADD_CATEGORY', takeLatest, 'post', 'user/dsa/', 'application/json')(),
    SAGA('UPDATE_CATEGORY', takeLatest, 'patch', 'user/dsa/', 'application/json')(),
    SAGA('DELETE_CATEGORY', takeLatest, 'delete', 'user/dsa/', 'application/json')(),
    SAGA('ADD_DSA_PATTERN', takeLatest, 'post', 'user/dsa-pattern/', 'application/json')(),
    SAGA('UPDATE_DSA_PATTERN', takeLatest, 'patch', 'user/dsa-pattern/', 'application/json')(),
    SAGA('DELETE_DSA_PATTERN', takeLatest, 'delete', 'user/dsa-pattern/', 'application/json')(),
    SAGA('ADD_DSA_PROBLEM', takeLatest, 'post', 'user/dsa-problems/', 'application/json')(),
    SAGA('UPDATE_DSA_PROBLEM', takeLatest, 'patch', 'user/dsa-problems/', 'application/json')(),
    SAGA('DELETE_DSA_PROBLEM', takeLatest, 'delete', 'user/dsa-problems/', 'application/json')(),
    SAGA('ADD_APPROACH', takeLatest, 'post', 'user/dsa-approaches/', 'application/json')(),
    SAGA('UPDATE_APPROACH', takeLatest, 'patch', 'user/dsa-approaches/', 'application/json')(),
    SAGA('DELETE_APPROACH', takeLatest, 'delete', 'user/dsa-approaches/', 'application/json')(),
    SAGA('EXECUTE_CODE', takeLatest, 'post', 'user/execute-code/', 'application/json')(),

    // Unstructured Notes Sagas
    SAGA('GET_UNSTRUCTURED_NOTES', takeLatest, 'list', 'user/unstructured/', 'application/json')(),
    SAGA('ADD_UNSTRUCTURED_NOTE', takeLatest, 'post', 'user/unstructured/', 'application/json')(),
    SAGA('UPDATE_UNSTRUCTURED_NOTE', takeLatest, 'patch', 'user/unstructured/', 'application/json')(),
    SAGA('DELETE_UNSTRUCTURED_NOTE', takeLatest, 'delete', 'user/unstructured/', 'application/json')(),
    SAGA('GENERATE_PREP_CHECKLIST', takeLatest, 'post', 'user/interview-prep/generate-checklist/', 'application/json')(),

    // Answer Bank Module Sagas
    SAGA('GET_ANSWERS', takeLatest, 'list', 'user/answer-bank/', 'application/json')(),
    SAGA('GET_ANSWER_DETAILS', takeLatest, 'detail', 'user/answer-bank/', 'application/json')(),
    SAGA('ADD_ANSWER', takeLatest, 'post', 'user/answer-bank/', 'application/json')(),
    SAGA('UPDATE_ANSWER', takeLatest, 'put', 'user/answer-bank/', 'application/json')(),
    SAGA('DELETE_ANSWER', takeLatest, 'delete', 'user/answer-bank/', 'application/json')(),
    SAGA('TRACK_PRACTICE', takeLatest, 'patch', 'user/answer-bank/practice/', 'application/json')(),
  ])
}