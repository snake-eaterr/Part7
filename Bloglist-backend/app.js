const express = require('express')
const config = require('./utils/config')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(() => {
		logger.info('connected to mongodb')
	})
	.catch(error => {
		logger.error('error conntecting to mongodb', error.message)
	})


app.use(cors())
app.use(middleware.getTokenFrom)
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
if(process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing')
	app.use('/api/testing', testingRouter)
}
app.use(middleware.errorHandler)

module.exports = app