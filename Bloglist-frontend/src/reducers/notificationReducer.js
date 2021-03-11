const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

let id

export const setNotification = (notification, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: notification
    })
    clearTimeout(id)
    id = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, time * 1000)
  }
}

export default notificationReducer