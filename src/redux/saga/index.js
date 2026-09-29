import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { SAGA } from './sagaWrapper'

// Wrap all sagas in a container
export default function* rootSaga() {
  yield all([
    // Existing job tracker sagas
    SAGA('GET_JOB_LIST', takeLatest, 'list', 'job/jobs/', 'application/json')(),
    SAGA('PATCH_JOB', takeLatest, 'patch', 'job/jobs/', 'application/json')(),
    SAGA('GET_JOB_MATCH_HISTORY', takeLatest, 'list', 'job/job-matches/', 'application/json')(),
    SAGA('GET_TECHSTACK_LIST', takeLatest, 'list', 'job/techs/', 'application/json')(),
    SAGA('GET_TECH_CONTEXT', takeLatest, 'list', 'job/techs/context/', 'application/json', true)(),
    SAGA('DELETE_TECHSTACK_ITEM', takeLatest, 'delete', 'job/techs/', 'application/json')(),
    SAGA('GET_POSTING_LIST', takeLatest, 'list', 'job/postings/', 'application/json')(),
    SAGA('GET_DAILY_JOB_COUNT', takeLatest, 'list', 'job/jobs/daily-count/', 'application/json')(),

    // Application Runs
    SAGA('GET_APPLICATION_RUNS', takeLatest, 'list', 'job/application-runs/', 'application/json', true)(),
    SAGA('APPROVE_APPLICATION', takeLatest, 'post', 'job/application-runs/:id/approve/', 'application/json', true)(),
    SAGA('REJECT_APPLICATION', takeLatest, 'post', 'job/application-runs/:id/reject/', 'application/json', true)(),

    // Unknown Tech Curation Sagas
    SAGA('GET_UNKNOWN_TECHS', takeLatest, 'list', 'job/unknown-techs/', 'application/json')(),
    SAGA('ACTION_UNKNOWN_TECH', takeLatest, 'post', 'job/unknown-techs/action/', 'application/json')(),
    SAGA('ADD_TO_JOBS_UNKNOWN_TECHS', takeLatest, 'post', 'job/unknown-techs/add-to-jobs/', 'application/json')(),

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

    // Applicant Automation Sagas
    SAGA('GET_PROFILE', takeLatest, 'list', 'user/profile/', 'application/json')(),
    SAGA('CREATE_PROFILE', takeLatest, 'post', 'user/profile/', 'application/json')(),
    SAGA('UPDATE_PROFILE', takeLatest, 'patch', 'user/profile/', 'application/json')(),
    
    SAGA('ADD_EXPERIENCE', takeLatest, 'post', 'user/experiences/', 'application/json')(),
    SAGA('UPDATE_EXPERIENCE', takeLatest, 'put', 'user/experiences/', 'application/json')(),
    SAGA('DELETE_EXPERIENCE', takeLatest, 'delete', 'user/experiences/', 'application/json')(),
    SAGA('ADD_EXPERIENCE_BULLET', takeLatest, 'post', 'user/bullets/', 'application/json')(),
    SAGA('EDIT_EXPERIENCE_BULLET', takeLatest, 'patch', 'user/bullets/', 'application/json')(),
    SAGA('DELETE_EXPERIENCE_BULLET', takeLatest, 'delete', 'user/bullets/', 'application/json')(),

    SAGA('ADD_EDUCATION', takeLatest, 'post', 'user/educations/', 'application/json')(),
    SAGA('UPDATE_EDUCATION', takeLatest, 'put', 'user/educations/', 'application/json')(),
    SAGA('DELETE_EDUCATION', takeLatest, 'delete', 'user/educations/', 'application/json')(),

    SAGA('ADD_PROJECT', takeLatest, 'post', 'user/projects/', 'application/json')(),
    SAGA('UPDATE_PROJECT', takeLatest, 'put', 'user/projects/', 'application/json')(),
    SAGA('DELETE_PROJECT', takeLatest, 'delete', 'user/projects/', 'application/json')(),
    SAGA('ADD_PROJECT_BULLET', takeLatest, 'post', 'user/bullets/', 'application/json')(),
    SAGA('EDIT_PROJECT_BULLET', takeLatest, 'patch', 'user/bullets/', 'application/json')(),
    SAGA('DELETE_PROJECT_BULLET', takeLatest, 'delete', 'user/bullets/', 'application/json')(),

    SAGA('GET_DEALBREAKER', takeLatest, 'list', 'user/dealbreakers/', 'application/json')(),
    SAGA('ADD_DEALBREAKER', takeLatest, 'post', 'user/dealbreakers/', 'application/json')(),
    SAGA('UPDATE_DEALBREAKER', takeLatest, 'patch', 'user/dealbreakers/', 'application/json')(),
    SAGA('DELETE_DEALBREAKER', takeLatest, 'delete', 'user/dealbreakers/', 'application/json')(),

    SAGA('GET_QUESTION', takeLatest, 'list', 'user/questions/', 'application/json')(),
    SAGA('ADD_QUESTION', takeLatest, 'post', 'user/questions/', 'application/json')(),
    SAGA('UPDATE_QUESTION', takeLatest, 'patch', 'user/questions/', 'application/json')(),
    SAGA('DELETE_QUESTION', takeLatest, 'delete', 'user/questions/', 'application/json')(),

    SAGA('ADD_QA_ANSWER', takeLatest, 'post', 'user/answers/', 'application/json')(),
    SAGA('UPDATE_QA_ANSWER', takeLatest, 'patch', 'user/answers/', 'application/json')(),
    SAGA('DELETE_QA_ANSWER', takeLatest, 'delete', 'user/answers/', 'application/json')(),

    // Auto-Apply Review Sagas
    SAGA('GET_APPLICATION_RUNS', takeLatest, 'list', 'job/application-runs/', 'application/json')(),
    SAGA('GET_PENDING_REVIEWS', takeLatest, 'list', 'job/application-runs/pending/', 'application/json')(),
    SAGA('APPROVE_APPLICATION', takeLatest, 'post', 'job/application-runs/', 'application/json')(),
    SAGA('REJECT_APPLICATION', takeLatest, 'post', 'job/application-runs/', 'application/json')(),
  ])
}