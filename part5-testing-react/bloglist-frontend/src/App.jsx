import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({username, password})
      setUser(user.data)
      setUsername('')
      setPassword('')

    } catch  {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  }

  const userInfo = () => {
    return <div>
      {user.name} logged in
    </div>
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} />
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} />
      
      <h2>blogs</h2>
      {user && userInfo()}
      <div>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
      
    </div>
  )
}

export default App