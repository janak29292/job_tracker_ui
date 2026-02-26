import { combineReducers } from 'redux';
import reducer from './reducers/commonReducer'
import { multiReducer } from './reducers/commonReducer'
// import { reducer as toastr } from "react-redux-toastr"

export default combineReducers({
  // toastr,
  jobList: reducer('GET_JOB_LIST'),
  jobDetails: reducer('PATCH_JOB'),
  techStackList: reducer('GET_TECHSTACK_LIST'),
  postingList: reducer('GET_POSTING_LIST'),
  dailyJobCount: reducer('GET_DAILY_JOB_COUNT'),

  // Analytics Module
  analyticsSummary: reducer('GET_ANALYTICS_SUMMARY'),
  channelPerformance: reducer('GET_CHANNEL_PERFORMANCE'),
  techDemand: reducer('GET_TECH_DEMAND'),
  applicationVelocity: reducer('GET_APPLICATION_VELOCITY'),
  ghostingAnalysis: reducer('GET_GHOSTING_ANALYSIS'),

  // Tech Proficiency Tracker Module
  techProficiencyList: reducer('GET_TECH_PROFICIENCY'),
  techComparison: reducer('COMPARE_TECH_WITH_JOB'),
  addTech: reducer('ADD_TECH'),
  updateTech: reducer('UPDATE_TECH'),
  deleteTech: reducer('DELETE_TECH'),

  // DSA Module — one reducer per entity, responds to all CRUD actions
  dsaList: reducer('GET_DSA_LIST'),
  dsaCategory: multiReducer('GET_DSA_CATEGORY', 'ADD_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY'),
  dsaPattern: multiReducer('ADD_DSA_PATTERN', 'UPDATE_DSA_PATTERN', 'DELETE_DSA_PATTERN'),
  dsaProblem: multiReducer('ADD_DSA_PROBLEM', 'UPDATE_DSA_PROBLEM', 'DELETE_DSA_PROBLEM'),
  dsaApproach: multiReducer('ADD_APPROACH', 'UPDATE_APPROACH', 'DELETE_APPROACH'),
  executeCode: reducer('EXECUTE_CODE'),
  prepChecklist: reducer('GENERATE_PREP_CHECKLIST'),

  // Unstructured Notes Module
  unstructuredList: reducer('GET_UNSTRUCTURED_NOTES'),
  unstructuredAction: multiReducer('ADD_UNSTRUCTURED_NOTE', 'UPDATE_UNSTRUCTURED_NOTE', 'DELETE_UNSTRUCTURED_NOTE'),

  // Answer Bank Module
  answersList: reducer('GET_ANSWERS'),
  answerDetails: reducer('GET_ANSWER_DETAILS'),
  addAnswer: reducer('ADD_ANSWER'),
  updateAnswer: reducer('UPDATE_ANSWER'),
  deleteAnswer: reducer('DELETE_ANSWER'),
  trackPractice: reducer('TRACK_PRACTICE'),
})
