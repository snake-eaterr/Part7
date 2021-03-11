import loginService from '../services/login'
import blogService from '../services/blogs'

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.data
    case 'LOGOUT':
      return null
    default:
      return state
  }
}


export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({username, password})
    window.localStorage.setItem('loggedinUser', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      data: user
    })
  }
}

export const checkStorage = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedinUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        data: user
      })
    }
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedinUser')
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export default userReducer