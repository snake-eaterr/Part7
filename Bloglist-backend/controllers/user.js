const bcrypt = require('bcrypt')
const { response } = require('express')
const { request } = require('http')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1})
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const body = request.body

    if((body.password === undefined) || (body.username === undefined)) {
        return response.status(400).json({error: 'invalid or missing username or password'})
    }

    if((body.password.length < 3) || (body.username < 3)) {
        return response.status(400).json({error: 'username and password should each be at least three characters long'})
    }
    

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

module.exports = userRouter