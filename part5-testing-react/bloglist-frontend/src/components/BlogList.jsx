import Blog from './Blog'

const BlogList = ({blogs, handleUpdateBlog}) => {
    
    return <div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} updateBlog={handleUpdateBlog}/>)}
    </div>
}

export default BlogList