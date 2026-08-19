import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const [user, setUser] = useState(null)

  //New Blog state
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser)
    blogService.setToken(loggedUser.token)
    window.localStorage.setItem(
      'loggedBlogAppUser', JSON.stringify(loggedUser)
    )
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = await blogService.create({
        title,
        author,
        url
      })

      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorMessage(`New Blog added: ${title}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    } catch {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  const userInfo = () => {
    return <div>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} />
        <h2>Log in to application</h2>
        <LoginForm onLoginSuccess={handleLoginSuccess} onError={setErrorMessage}/>
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} />
      
      <h2>blogs</h2>
      {user && userInfo()}

      <h2>create new</h2>
      {blogForm()}

      <div>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
      
    </div>
  )
}

export default App