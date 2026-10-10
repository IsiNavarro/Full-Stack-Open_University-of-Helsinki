import { useNavigate } from 'react-router-dom'

const BlogView = ({ blog, user, updateBlog, handleDeleteBlog }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  const handleLike = () => {
    updateBlog(blog.id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      await handleDeleteBlog(blog.id)
      navigate('/')
    }
  }

  return (
    <div className="blog-view">
      <h2>{blog.title} {blog.author}</h2>
      <div className="blog-url">
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div className="blog-likes">
        {blog.likes} likes
        {user && <button onClick={handleLike}>like</button>}
      </div>
      <div>added by {blog.user?.name}</div>
      {isCreator && <button onClick={handleDelete}>delete</button>}
    </div>
  )
}

export default BlogView