const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')

const api = supertest(app)
jest.setTimeout(50000)
const blogs = [ { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }, { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }, { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 }, { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 }, { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }]

const listWithOneBlog = [
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0
	}
]
beforeEach(async () => {
	await Blog.deleteMany({})

	for(let blog of blogs) {
		let blogObject = new Blog(blog)
		await blogObject.save()
	}
})

test('dummy returns one', () => {
	const blogs = []

	const result = listHelper.dummy(blogs)
	expect(result).toBe(1)
}) 

describe('total likes', () => {
	
	test('when list has only one blog, equals the likes of that blog', () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		expect(result).toBe(5)
	})
	const emptyList = []
	test('of empty list is zero', () => {
		const result = listHelper.totalLikes(emptyList)
		expect(result).toBe(0)
	})

	test('of a blogger list is calcualted right', () => {
		const result = listHelper.totalLikes(blogs)
		expect(result).toBe(36)
	})

})
describe('most likes', () => {
	test('returns an object of the most liked blog', () => {
		const result = listHelper.favoriteBlog(blogs)
		expect(result).toEqual(blogs[2])
	})

	test('when blog list is empty, returns undefined', () => {
		const result = listHelper.favoriteBlog([])
		expect(result).toBe(undefined)
	})
	
	test('when list has only one blog, returns the single blog', () => {
		const result = listHelper.favoriteBlog(listWithOneBlog)
		expect(result).toEqual(listWithOneBlog[0])
	})
})

describe('most blogs', () => {
	test('returns an object indicating author with most blogs', () => {
		const result = listHelper.mostBlogs(blogs)
		expect(result.author).toBe(blogs[3].author)
	})

})
describe('most likes', () => {
	test('returns an object indicating author with most like across blogs', () => {
		const result = listHelper.mostLikes(blogs)
		expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
	})
})

describe('blogs api behavior', () => {
	

	test('the correct number of blogs are returned in the json format', async () => {
		const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(response.body).toHaveLength(blogs.length)

		
	})

	test('the property id is defined in the returned blog posts', async () => {
		const response = await api.get('/api/blogs')

		expect(response.body[0].id).toBeDefined()
	})
	
	test('making a POST request to api/blogs successfuly creates a new blog post', async () => {
		const newBlog = {
			title: 'Typescript',
			author: 'sanke',
			url: 'happy.com/sdfjsklfj',
			likes: 50
		}
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await Blog.find({})
		expect(blogsAtEnd).toHaveLength(blogs.length + 1)

	})

	test('if the likes property is missing from the request, it will default to 0', async () => {
		const newBlog = {
			title: 'Typescript',
			author: 'sanke',
			url: 'happy.com/sdfjsklfj'
		}
		await api
			.post('/api/blogs')
			.send(newBlog)
		
		const blogsAtEnd = await Blog.find({})
		expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
	})

	test('if url and title properties are missing from request, server responds with 400', async () => {
		const newBlog = {
			author: 'sanke',
			likes: 50
		}
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
	})

	test('a single blog post can be deleted, with 204 returned', async () => {
		const blogsAtStart = await Blog.find({})
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
		const blogsAtEnd = await Blog.find({})
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
	})

	test('updating a blog likes succeeds', async () => {
		const blogsAtStart = await Blog.find({})
		const blogToUpdate = blogsAtStart[0]

		const blog = {likes: 1000}

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blog)
			.expect(200)

		const blogsAtEnd = await Blog.find({})
		expect(blogsAtEnd[0].likes).toBe(blog.likes)
	})

})
const users = [
	{
		username: 'snake',
		name: 'jack',
		password: 'jlksdjfksj'
	},
	{
		username: 'solid',
		name: 'twitter',
		password: 'uriwioeruv'
	}
]
describe('users api behavior', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		for(let user of users) {
			const userObject = new User(user)
			await userObject.save()
		}
	})

	test('missing username or password is responded to with 400 and error message', async () => {
		const usersAtStart = await User.find({})

		const newUser = {
			name: 'kingofdicks'
		}

		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)
		
		const usersAtEnd = await User.find({})
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
		expect(response.body.error).toBe('invalid or missing username or password')
	})
	
	test('requests with username or password with less than three characters get 400 and error message', async () => {
		const usersAtStart = await User.find({})

		const newUser = {
			username: 'sj',
			name: 'ssfd',
			password: 's'
		}

		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await User.find({})
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
		expect(response.body.error).toBe('username and password should each be at least three characters long')
	})

	test('requests with an existing username are rejected with 400 and error message', async () => {
		const usersAtStart = await User.find({})

		const newUser = {
			username: users[0].username,
			name: 'sjdfksjf',
			password: 'hfdsfj'
		}

		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await User.find({})
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
		expect(response.body.error).toBe('username must be unique')
	})
})


afterAll(() => {
	mongoose.connection.close()
})