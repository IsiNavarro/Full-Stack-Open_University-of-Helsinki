const Blog = require('../models/blog')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
}