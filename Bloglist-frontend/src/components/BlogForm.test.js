import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import BlogForm from './BlogForm'

const blog = {
	title: 'the benefits of sleeping',
	author: 'snake',
	url: 'sleepcom',
	likes: 5000,
	user: {
		username: 'snake',
		name: 'solid',
		token: 'sdkjfsdf'
	}
}

test('on submit, the form calls the the event handler with the right props', () => {
	const createBlog = jest.fn()

	const component = render(
		<BlogForm createBlog={createBlog} />
	)

	const titleInput = component.container.querySelector('#title')
	const authorInput = component.container.querySelector('#author')
	const urlInput = component.container.querySelector('#url')
	const form = component.container.querySelector('form')

	fireEvent.change(titleInput, {
		target: {value: blog.title}
	})
	fireEvent.change(authorInput, {
		target: {value: blog.author}
	})
	fireEvent.change(urlInput, {
		target: {value: blog.url}
	})

	fireEvent.submit(form)

	expect(createBlog.mock.calls).toHaveLength(1)
	expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
	expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
	expect(createBlog.mock.calls[0][0].url).toBe(blog.url)


})