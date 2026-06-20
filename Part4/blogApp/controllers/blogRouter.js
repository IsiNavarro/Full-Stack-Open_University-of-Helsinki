const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenfrom = (request) => {
        const authorization = request.get('authorization')
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '')
        }
        return null
    }

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenfrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(400).json( { error: 'UserId missing or not valid' })
    }
    const blog = new Blog ({
        title: body.author,
        likes: body.likes,
        author: body.author,        
        user: user._id
    })

    const savedResult = await blog.save()
    response.status(201).json(savedResult)
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blogUpdates = {}
    if (body.title !== undefined) blogUpdates.title = body.title
    if (body.author !== undefined) blogUpdates.author = body.author
    if (body.url !== undefined) blogUpdates.url = body.url
    if (body.likes !== undefined) blogUpdates.likes = body.likes

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id, 
        blogUpdates, 
        { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

module.exports = blogRouter