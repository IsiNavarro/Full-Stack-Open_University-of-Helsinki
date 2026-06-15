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
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}