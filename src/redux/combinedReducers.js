import { combineReducers } from 'redux';
import reducer from './reducers/commonReducer'
// import { reducer as toastr } from "react-redux-toastr"

export default combineReducers({
  // toastr,
  jobList: reducer('GET_JOB_LIST'),
  jobDetails: reducer('PATCH_JOB'),
  techStackList: reducer('GET_TECHSTACK_LIST')
})
