import Toggable from './Toggable'

const Blog = ({ blog, updateBlog, handleDeleteBlog }) => {

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

  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleDeleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">{blog.title} {blog.author}</div>
      <Toggable buttonLabel='view' buttonLabelTwo='hide'>
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">{blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user.username}</div>
          <div><button onClick={handleDelete}>delete</button></div>
        </div>
      </Toggable>
    </div> )
}


export default Blog