import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'
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


  return (
    <form onSubmit={handleLogin}>
      <Stack spacing={2} sx={{ maxWidth: 250, alignItems: 'flex-start' }}>
        <TextField
          id="username"
          label="username"
          variant="standard"
          fullWidth
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          id="password"
          label="password"
          type="password"
          variant="standard"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
        />
        <Button variant="contained" type="submit">
          login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm