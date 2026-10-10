import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {

  return <div>
    {[...blogs] // sort mutates the array, so we create a copy as to not mutate state
      .sort((a, b) => b.likes - a.likes)
      .map(blog =>
        <div key={blog.id} className="blog-summary">
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      )}
  </div>
}

export default BlogList