const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

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