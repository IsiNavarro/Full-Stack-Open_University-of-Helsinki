const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0
    ? null
    : blogs.reduce((max, current) => {
        return current.likes > max.likes ? current : max
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.entries(authorCounts), (entry) => entry[1] )

    return {
        author: topAuthor[0],
        blogs: topAuthor[1]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const groupedAuthors = _.groupBy(blogs, 'author')
    const authorLikesList = _.map(groupedAuthors, (authorBlogs, authorName) => {
        return {
            author: authorName,
            likes: _.sumBy(authorBlogs, 'likes')
        }
    })

    return _.maxBy(authorLikesList, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}