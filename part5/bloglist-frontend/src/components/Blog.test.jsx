import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but does not render URL or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser',
    },
  }

  const { container } = render(<Blog blog={blog} />)

  const element = screen.getByText(
    'Component testing is done with react-testing-library Test Author',
  )
  expect(element).toBeDefined()

  const details = container.querySelector('.blog-details')
  expect(details).toBeNull()

  const url = screen.queryByText('http://testurl.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 5')
  expect(likes).toBeNull()
})

test('at clicking the button, the extra details are shown', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser',
    },
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const details = container.querySelector('.blog-details')
  expect(details).not.toBeNull()

  expect(screen.getByText('http://testurl.com')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
})

test('if the like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser',
    },
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
