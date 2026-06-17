const assert = require('node:assert')
const {test, after, beforeEach} = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const { before } = require('lodash')

const api = supertest(app)

const initialBlogs = [
    {
        title: "Title",
        author: "Some Author",
        url: "SomeURL",
        likes: 13
    },
    {
        title: "Second Title",
        author: "Some Other Author",
        url: "a different URL",
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})