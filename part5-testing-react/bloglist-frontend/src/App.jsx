import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'

import { Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

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
      }, 5000)

    } catch {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleUpdateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog =>
        (blog.id === id) ? returnedBlog : blog
      ))
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleDeleteBlog = async id => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setErrorMessage('Blog removed')
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (exception) {
      const message = exception.response?.data?.error || 'Removing the blog failed'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const padding = {
    padding: 5
  }
  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && <Link style={padding} to="/create">create new</Link>}
        {user && (
          <span>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </span>
        )}
      </div>

      <Notification message={errorMessage} />

      {!user && (
        <div>
          <h2>Log in to application</h2>
          <LoginForm onLoginSuccess={handleLoginSuccess} onError={setErrorMessage} />
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            <BlogList blogs={blogs} />
          </div>
        } />
        <Route path="/blogs/:id" element={
          <BlogView
            blog={blog}
            user={user}
            updateBlog={handleUpdateBlog}
            handleDeleteBlog={handleDeleteBlog}
          />
        } />
        <Route path="/create" element={
          user ? <BlogForm addBlog={addBlog} /> : <Navigate replace to="/" />
        } />
      </Routes>
    </div>
  )
}

export default App