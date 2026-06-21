const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user
    
    const blog = new Blog ({
        title: body.author,
        likes: body.likes,
        author: body.author,        
        user: user._id
    })

    const savedResult = await blog.save()
    response.status(201).json(savedResult)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user._id.toString()) {
        await blog.deleteOne()
        response.status(204).end()
    } else {
        return response.status(403).json( {error: 'User attempting to delete is not the user who added the blog'})
    }

    
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