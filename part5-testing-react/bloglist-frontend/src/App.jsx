import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  // Get All Blogs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // Check localStorage for logged user
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
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (newBlogObject) => {
    event.preventDefault()

    try {
      const newBlog = await blogService.create(newBlogObject)

      setBlogs(blogs.concat(newBlog))

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

      <Togglable buttonLabel='create new blog'>
        <BlogForm addBlog={addBlog}/>
      </Togglable>
      

      <BlogList blogs={blogs}/>
      
    </div>
  )
}

export default App