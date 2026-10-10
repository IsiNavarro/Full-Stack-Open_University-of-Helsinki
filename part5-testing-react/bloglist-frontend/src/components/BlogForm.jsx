import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="write title here"
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="write author here"
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="write url here"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )


}


export default BlogForm