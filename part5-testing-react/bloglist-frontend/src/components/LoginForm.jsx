import { useState } from "react"
import loginService from '../services/login'

const LoginForm = ({
    onLoginSuccess,
    onError
  }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUsername('')
      setPassword('')
      onLoginSuccess(user)
    } catch {
      onError('wrong credentials')
    }
  }


    return <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  }

  export default LoginForm