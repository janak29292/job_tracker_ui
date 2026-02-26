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

// Reducer that responds to multiple action names.
// Stores `lastAction` so the UI knows which operation triggered the change.
export function multiReducer(...actionNames) {
  return function reducer(state = { data: null }, action) {
    for (const actionName of actionNames) {
      switch (action.type) {
        case `${actionName}_STARTED`:
          return { data: null, changingStatus: 'ongoing', lastAction: actionName }
        case `${actionName}_SUCCESS`:
          return { ...state, changingStatus: 'success', data: action.payload, lastAction: actionName }
        case `${actionName}_FAILED`:
          return { ...state, changingStatus: 'failed', data: action.payload, lastAction: actionName }
        case `${actionName}_NET_FAILED`:
          return { ...state, changingStatus: 'netFailed', data: action.payload, lastAction: actionName }
      }
    }
    return state
  }
}
