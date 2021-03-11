import blogService from '../services/blogs'


const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT':
      return action.data
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'DELETE':
      return state.filter(b => b.id !== action.data.id)
    case 'UPDATE_LIKES':
      return state.map(b => b.id !== action.data.id ? b : action.data)
    case 'COMMENT': {
      const blog = state.find(b => b.id === action.blogId)
      blog.comments = blog.comments.concat(action.data)
      return state.map(b => b.id !== blog.id ? b : blog)
    }
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const response = await blogService.getAll()
    dispatch({
      type: 'INIT',
      data: response
    })
  }
}

export const newBlog = (blogObject) => {
  return async dispatch => {
    const response = await blogService.create(blogObject)
    console.log(response)
    dispatch({
      type: 'NEW_BLOG',
      data: response
    })
  }
}

export const updateLikes = (blog) => {
  return async dispatch => {
    const newObject = {
      ...blog, likes: blog.likes + 1
    }
    const response = await blogService.update(newObject)
    dispatch({
      type: 'UPDATE_LIKES',
      data: response
    })
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    await blogService.remove(blog.id)
    dispatch({
      type: 'DELETE',
      data: blog
    })
  }
}

export const addComment = (blog, comment) => {
  return async dispatch => {
    let response
    try {
      response = await blogService.comment(blog, comment)
    } catch (expection) {
      alert('comment cannot be empty')
      return 
    }
    dispatch({
      type: 'COMMENT', 
      data: response,
      blogId: blog.id
    })
  }
}

export default blogReducer