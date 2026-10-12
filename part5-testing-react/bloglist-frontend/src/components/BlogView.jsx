import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Link, Button, Stack } from '@mui/material'

const BlogView = ({ blog, user, updateBlog, handleDeleteBlog }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  const handleLike = () => {
    updateBlog(blog.id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      const success = await handleDeleteBlog(blog.id)
      if (success) {
        navigate('/')
      }
    }
  }

  return (
    <Card className="blog-view" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Typography className="blog-url" gutterBottom>
          <Link href={blog.url}>{blog.url}</Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Added by {blog.user?.name}
        </Typography>

        <Stack direction="row" spacing={2} className="blog-likes" sx={{ alignItems: 'center', mt: 2 }}>
          <Typography variant="h6" component="span">
            {blog.likes} likes
          </Typography>
          {user && (
            <Button variant="outlined" onClick={handleLike}>
              like
            </Button>
          )}
          {isCreator && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              delete
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlogView