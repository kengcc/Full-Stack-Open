import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Find the inputs by their names or placeholders if available.
  // Looking at BlogForm.jsx, it has names 'title', 'author', 'url'.
  // We can use container.querySelector or getByRole if applicable.
  // Standard way is to use getByRole or getByLabelText but the inputs don't have labels.
  // They have text content preceding them.

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'Testing Form Title')
  await user.type(inputs[1], 'Testing Form Author')
  await user.type(inputs[2], 'http://testingformurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Form Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Form Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testingformurl.com')
})
