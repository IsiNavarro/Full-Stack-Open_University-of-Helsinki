import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'

import { Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
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

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

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
    try {
      const newBlog = await blogService.create(newBlogObject)
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      return true
    } catch {
      notify('Failed to add blog', 'error')
      return false
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
      notify('Blog removed')
      return true
    } catch (exception) {
      const message = exception.response?.data?.error || 'Removing the blog failed'
      notify(message, 'error')
      return false
    }
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create">create new</Button>}
          {user && (
            <>
              <Typography sx={{ mx: 2 }}>{user.name} logged in</Typography>
              <Button color="inherit" onClick={handleLogout}>logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      {!user && (
        <div>
          <h2>Log in to application</h2>
          <LoginForm onLoginSuccess={handleLoginSuccess} onError={(message) => notify(message, 'error')} />
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
    </Container>
  )
}

export default App