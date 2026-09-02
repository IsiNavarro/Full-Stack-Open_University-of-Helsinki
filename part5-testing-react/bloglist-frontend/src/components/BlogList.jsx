import Blog from './Blog'

const BlogList = ({blogs, handleUpdateBlog}) => {

    return <div>
        {[...blogs] // sort mutates the array, so we create a copy as to not mutate state
        .sort((a, b) => b.likes - a.likes)
        .map(blog => <Blog key={blog.id} blog={blog} updateBlog={handleUpdateBlog}/>)}
    </div>
}

export default BlogList