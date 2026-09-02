import Toggable from './Toggable'

const Blog = ({ blog, updateBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()

    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    updateBlog(blog.id, updatedBlog)
  }

  return (
  <div style={blogStyle}>
    <div>{blog.title} {blog.author}</div>
    <Toggable buttonLabel='view' buttonLabelTwo='hide'>
      <div>{blog.url}</div>
      <div>{blog.likes} <button onClick={handleLike}>like</button></div>
      <div>{blog.user.username}</div>
    </Toggable>
  </div> )
}
  

export default Blog