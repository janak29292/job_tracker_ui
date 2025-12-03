export default actionName => function reducer(
  state = {
    data: null
  },
  action
) {
  switch (action.type) {
    case `${actionName}_STARTED`: {
      return { data: null, changingStatus: 'ongoing' }
    }
    case `${actionName}_SUCCESS`: {
      return {
        ...state,
        changingStatus: 'success',
        data: action.payload
      }
    }
    case `${actionName}_FAILED`: {
      return { ...state, changingStatus: 'failed', data: action.payload }
    }
    case `${actionName}_NET_FAILED`: {
      return {
        ...state,
        changingStatus: 'netFailed',
        data: action.payload
      }
    }
    default: {
      return state
    }
  }
}
