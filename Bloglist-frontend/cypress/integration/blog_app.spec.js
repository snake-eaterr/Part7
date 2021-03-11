const { func } = require("prop-types")


describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
		const user = {
			username: 'snake',
			name: 'solid snake',
			password: 'snakeeater'
		}
		cy.request('POST', 'http://localhost:3003/api/users', user)
		cy.visit('http://localhost:3000')
	})

	it('application displays login form by default', function () {
		cy.contains('log in to application')
		cy.contains('login')
	})

	describe('login', function () {
		it('succeeds with correct credentials', function () {
			cy.get('#username').type('snake')
			cy.get('#password').type('snakeeater')
			cy.get('#login-button').click()

			cy.contains('solid snake logged in')
		})

		it('fails with wrong credentials', function () {
			cy.get('#username').type('snake')
			cy.get('#password').type('wrong')
			cy.get('#login-button').click()

			cy.contains('Wrong credentails') //wrong spelling, yeah
		})
	})
	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({username: 'snake', password: 'snakeeater'})
			cy.visit('http://localhost:3000')
		})

		it('a user can create a new blog', function () {
			cy.contains('new blog').click()

			cy.get('#title').type('how to sleep')
			cy.get('#author').type('Boss')
			cy.get('#url').type('sleep.com')
			cy.get('#submit-button').click()

			cy.get('.notExpanded').should('contain', 'how to sleep')
				.and('contain', 'Boss')
		})
		describe('when theres a blog', function () {
			beforeEach(function () {
				cy.createBlog({title: 'how to sleep', author: 'snake', url: 'sleeping.com', likes: 0})
			})

			it('a user can like a blog', function() {
				cy.contains('view').click()

				cy.contains('like').click()
				cy.contains('1')
			})

			it('a user can delete a blog which they created', function() {
				cy.contains('view').click()
				cy.contains('remove').click()
				cy.get('html').should('not.contain', 'how to sleep')
			})

			it('when there is more than one blog, blogs are listed based on likes', function() {
				cy.createBlog({title: 'how to eat', author: 'snake', url: 'eating.com', likes:50})
				cy.createBlog({title: 'how to run', author: 'snake', url: 'running.com', likes: 70})

				cy.get('.notExpanded').first().contains('how to run')

			})
		})
	})
})