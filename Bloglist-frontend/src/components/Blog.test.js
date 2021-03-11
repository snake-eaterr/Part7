import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
	title: 'the benefits of sleeping',
	author: 'snake',
	url: 'sleep.com/benefitsofsleep',
	likes: 5000,
	user: {
		username: 'snake',
		name: 'solid',
		token: 'sdkjfsdf'
	}
}

// a user object for satisfying the component's needs
const user = {
	username: 'snake',
	name: 'solid',
	token: 'sdkjfsdf'

}

test('renders blog with title and author, but not with likes and url', () => {
	const component = render(
		<Blog blog={blog} user={user} />
	)

	expect(component.container).toHaveTextContent(blog.title)
	expect(component.container).toHaveTextContent(blog.author)
	expect(component.container).not.toHaveTextContent(blog.likes)
	expect(component.container).not.toHaveTextContent(blog.url)
})

test('after the view button is clicked, the url and number of likes are also visible', () => {
	const component = render(
		<Blog blog={blog} user={user} />
	)

	const viewButton = component.container.querySelector('.view')
	fireEvent.click(viewButton)

	expect(component.container).toHaveTextContent(blog.likes)
	expect(component.container).toHaveTextContent(blog.url)
})

test('when the like button is clicked twice, the associated event handler is called twice as well', () => {
	const mockHandler = jest.fn()

	const component = render(
		<Blog blog={blog} user={user} updateLikes={mockHandler} />
	)

	const viewButton = component.container.querySelector('.view')
	fireEvent.click(viewButton)

	const likeButton = component.container.querySelector('.like')
	fireEvent.click(likeButton)
	fireEvent.click(likeButton)
	expect(mockHandler.mock.calls).toHaveLength(2)

})