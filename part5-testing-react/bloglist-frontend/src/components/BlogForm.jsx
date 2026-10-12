import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Stack } from '@mui/material'

const BlogForm = ({ addBlog }) => {
  //New Blog state
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const success = await addBlog({ title, author, url })

    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    }
  }


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 500, alignItems: 'flex-start' }}>
          <TextField
            id="title"
            label="title"
            fullWidth
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="write title here"
          />
          <TextField
            id="author"
            label="author"
            fullWidth
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="write author here"
          />
          <TextField
            id="url"
            label="url"
            fullWidth
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="write url here"
          />
          <Button variant="contained" type="submit">
            create
          </Button>
        </Stack>
      </form>
    </div>
  )


}


export default BlogForm