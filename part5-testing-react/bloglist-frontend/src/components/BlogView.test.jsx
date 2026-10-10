import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogView from './BlogView'

describe('<BlogView />', () => {
  const blog = {
    id: 'someId',
    title: 'someTitle',
    author: 'Sam Author',
    url: 'someUrl.com',
    likes: 7,
    user: { id: 'u1', username: 'creator', name: 'blogCreator' },
  }

  const creator = { username: 'creator', name: 'blogCreator' }
  const otherUser = { username: 'other', name: 'otherUser' }

  const renderBlogView = (user, updateBlog = vi.fn()) => {
    return render(
      <MemoryRouter>
        <BlogView
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          handleDeleteBlog={vi.fn()}
        />
      </MemoryRouter>
    )
  }

  test('shows blog info and likes to unauthenticated users, but no buttons', () => {
    const { container } = renderBlogView(null)

    expect(screen.getByRole('heading')).toHaveTextContent(blog.title)
    expect(screen.getByRole('heading')).toHaveTextContent(blog.author)
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(container.querySelector('.blog-likes')).toHaveTextContent('7 likes')

    expect(screen.queryByRole('button')).toBeNull()
  })

  test('shows only the like button to a logged-in user who is not the creator', () => {
    renderBlogView(otherUser)

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'delete' })).toBeNull()
  })

  test('shows both the like and delete buttons to the creator', () => {
    renderBlogView(creator)

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'delete' })).toBeVisible()
  })

  test('calls updateBlog twice when the like button is clicked twice', async () => {
    const updateBlog = vi.fn()
    const user = userEvent.setup()
    renderBlogView(otherUser, updateBlog)

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})