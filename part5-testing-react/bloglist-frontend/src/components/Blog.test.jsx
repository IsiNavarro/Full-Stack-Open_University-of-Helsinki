import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'This is the title',
    author: 'Author Name',
    url: 'https://example.com/testing',
    likes: 7,
    user: { id: 'userid1', username: 'username1', name: 'Name Surname' },
  }

  test('renders title and author, but not url or likes by default', () => {
    const { container } = render(
      <Blog blog={blog} updateBlog={vi.fn()} handleDeleteBlog={vi.fn()} />
    )

    const summary = container.querySelector('.blog-summary')
    expect(summary).toHaveTextContent(blog.title)
    expect(summary).toHaveTextContent(blog.author)
    expect(summary).toBeVisible()

    const details = container.querySelector('.blog-details')
    expect(details).not.toBeVisible()
    expect(screen.getByText(blog.url)).not.toBeVisible()
  })

  test('shows url and likes after the view button is clicked', async () => {
    const { container } = render(
      <Blog blog={blog} updateBlog={vi.fn()} handleDeleteBlog={vi.fn()} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const details = container.querySelector('.blog-details')
    expect(details).toBeVisible()

    const url = container.querySelector('.blog-url')
    expect(url).toBeVisible()
    expect(url).toHaveTextContent(blog.url)

    const likes = container.querySelector('.blog-likes')
    expect(likes).toBeVisible()
    expect(likes).toHaveTextContent(`${blog.likes}`)
  })
  test('calls updateBlog twice when the like button is clicked twice', async () => {
    const mockUpdateBlog = vi.fn()

    render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} handleDeleteBlog={vi.fn()} />
    )

    const user = userEvent.setup()

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })


})