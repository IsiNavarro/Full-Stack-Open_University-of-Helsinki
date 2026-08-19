import Toggable from './Toggable'

const Blog = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()

    console.log('like clicked')
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