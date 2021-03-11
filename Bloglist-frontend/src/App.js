import React, { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import loginService from './services/login'
import './index.css'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import notificationReducer, { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { login, checkStorage, logout } from './reducers/userReducer'
import Users from './components/Users'
import User from './components/User'
import {
	BrowserRouter as Router,
	Switch, Link, Route
} from 'react-router-dom'
import { Table, Form, Button, Navbar, Nav } from 'react-bootstrap'



const App = () => {
	const blogs = useSelector(state => state.blogs)
	const user = useSelector(state => state.user)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [users, setUsers] = useState([])
	const dispatch = useDispatch()
	const notification = useSelector(state => state.notification)

	const blogFormRef = useRef()

	useEffect(() => {
		dispatch(initializeBlogs())
		loginService.getUsers().then(returnedUsers => setUsers(returnedUsers))
	}, [])

	useEffect(() => {
		dispatch(checkStorage())
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			dispatch(login(username, password))
		} catch (exception) {
			dispatch(setNotification('Wrong credentials', 5))
		}
	}

	const handleLogOut = () => {
		dispatch(logout())
	}

	const triggerToggle = () => {
		blogFormRef.current.toggleVisibility()
	}


	if(user === null) {
		return (
			<div>
				<Notification message={notification} />
				<h2>log in to application</h2>
				<Form onSubmit={handleLogin}>
					<Form.Group>
						<Form.Label>username:</Form.Label>
						<Form.Control
							type="text"
							name="username"
							onChange={({target}) => setUsername(target.value)}
							value={username}
						/>
						<Form.Label>password:</Form.Label>
						<Form.Control
							type="password"
							value={password}
							onChange={({target}) => setPassword(target.value)}
						/>
						<Button variant="primary" type="submit">
							login
						</Button>
					</Form.Group>
				</Form>
			</div>
		)
	}

	const sortedBlogs = [...blogs].sort((a, b) => {
		if(a.likes > b.likes) {
			return -1
		}
	})

	
	const padding = {
		padding: 5
	}
	return (
		<Router>
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="#" as="span">
							<Link to="/" style={padding}>blogs</Link>
						</Nav.Link>
						<Nav.Link href="#" as="span">
							<Link to="/users" style={padding}>users</Link>
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<Notification message={notification} />
			<h2>blog app</h2>
			<div>
				<p>{user.name} logged in <Button onClick={handleLogOut}>log out</Button></p>
			</div>
			<Switch>
				<Route path="/users/:id">
					<User users={users} />
				</Route>
				<Route path="/blogs/:id">
					<Blog users={users} />
				</Route>
				<Route path="/users">
					<Users users={users} />
				</Route>
				<Route path="/">
					<Togglable buttonLabel="new blog" ref={blogFormRef}>
						<BlogForm triggerToggle={triggerToggle} />
					</Togglable>
					<Table striped>
						<tbody>
							{sortedBlogs.map(blog => 
								<tr key={blog.id}>
									<td>
										<Blogs key={blog.id} blog={blog} user={user} />
									</td>
								</tr>)}
						</tbody>
					</Table>
				</Route>
			</Switch>
		</Router>
	)
}

export default App