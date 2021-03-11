import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateLikes, removeBlog, addComment } from '../reducers/blogReducer'
import { Button } from 'react-bootstrap'


const Blog = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const history = useHistory()

  const handleLike = () => {
		dispatch(updateLikes(blog))
	}

  const handleDelete = () => {
		if(window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
			dispatch(removeBlog(blog))
      history.push("/")
		}
	}

  const handleComment = (event) => {
    event.preventDefault()

    const comment = event.target.comment.value
    event.target.comment.value = ''
    dispatch(addComment(blog, comment))
  }
  
  let RemoveButtonStyle
  if (blog && user) {
    if(blog.user.username === user.username) {
      RemoveButtonStyle = {display: ''}
    } else {
      RemoveButtonStyle = {display: 'none'}
    }
  }
	

  if(!blog || !user) {
    return null
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes}
        <Button onClick={handleLike}>like</Button>
      </div>
      <div>Added by {blog.user.name}</div>
      <div style={RemoveButtonStyle}>
        <Button onClick={handleDelete}>remove</Button>
      </div>
      <h3>comments</h3>
      <div>
        <form onSubmit={handleComment}>
          <input name="comment" />
          <Button type="submit">comment</Button>
        </form>
      </div>
      <ul>
        {blog.comments.map(c => {
          return <li key={c.id}>{c.comment}</li>
        })}
      </ul>
    </div>
  )
}

export default Blog