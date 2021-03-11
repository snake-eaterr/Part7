import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { newBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap' 

const BlogForm = ({ triggerToggle }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const dispatch = useDispatch()


	const addBlog = event => {
		event.preventDefault()

		dispatch(newBlog({title, author, url}))
		triggerToggle() // we use this because the App component can access Togglable ref
		dispatch(setNotification(`a new blog ${title} by ${author} was added`, 5))
		setTitle('')
		setAuthor('')
		setUrl('')
	}


	return (
		<div>
			<h2>Create new</h2>
			<Form onSubmit={addBlog}>
				<Form.Group>
					<Form.Label>title:</Form.Label>
					<Form.Control
						type="text"
						value={title}
						onChange={({target}) => setTitle(target.value)}
						name="title"
					/>
					<Form.Label>author:</Form.Label>
					<Form.Control
						type="text"
						value={author}
						onChange={({target}) => setAuthor(target.value)}
						name="Author"
					/>
					<Form.Label>url:</Form.Label>
					<Form.Control
						type="text"
						value={url}
						onChange={({target}) => setUrl(target.value)}
						name="url"
					/>
					<Button type="submit" variant="primary">create</Button>
				</Form.Group>
			</Form>
		</div>
	)
}

export default BlogForm