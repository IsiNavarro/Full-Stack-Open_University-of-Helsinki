const assert = require('node:assert')
const {test, after, beforeEach} = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const authors = response.body.map(e => e.author)
    assert(authors.includes('Some Author'))
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "new Title",
        author: "new Author",
        url: "new URL",
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(n => n.author)
    assert(authors.includes("new Author"))
})

test('identifier is called id and not _id', async () => {
    const response = await api.get('/api/blogs')
    console.log('RESPONSE BODY:', response.body)

    const sampleBlog = response.body[0]
    assert(Object.hasOwn(sampleBlog, 'id'))
    assert(!Object.hasOwn(sampleBlog, '_id'))
})

after(async () => {
    await mongoose.connection.close()
})