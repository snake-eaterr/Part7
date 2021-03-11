const blogRouter = require('express').Router()
const { response, request } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Comment = require('../models/comments')

blogRouter.get('/', async (request, response) => {
  blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1}).populate('comments', {comment: 1})
  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
	const body = request.body

	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if((request.token === undefined) || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'})
	}

	const user = await User.findById(decodedToken.id)
	if(body.likes === undefined) {
		body.likes = 0
	}

	if((body.title === undefined) && (body.url === undefined)) {
		return response.status(400).end()
	}
	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id
	})

	const result = await blog.save()
	await result.populate('user', {username: 1, name: 1, id: 1}).execPopulate()
	user.blogs = user.blogs.concat(result._id)
	await user.save()
	response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if((request.token === undefined) || !decodedToken) {
		return response.status(401).end()
	}
	const blogTodelete = await Blog.findById(request.params.id)
	if(decodedToken.id.toString() === blogTodelete.user.toString()) {
		const result = await Blog.findByIdAndRemove(request.params.id)
		return response.status(204).end()
	} else {
		return response.status(401).json({error: 'no ownership'})
	}
	
})

blogRouter.put('/:id', async (request, response) => {
	const body = request.body

	const blog = {
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
	response.json(updatedBlog)
})

blogRouter.post('/:id/comments', async (request, response) => {
	const body = request.body

	const comment = new Comment({
		comment: body.comment
	})

	const result = await comment.save()
	const blog = await Blog.findById(request.params.id)
	blog.comments = blog.comments.concat(result._id)
	await blog.save()
	response.status(201).json(result)
})

module.exports = blogRouter