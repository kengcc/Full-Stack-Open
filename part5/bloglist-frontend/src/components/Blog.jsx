import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}{' '}
        <button type='button' onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className='blog-details'>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button type='button'>like</button>
          </div>
          <div>{blog.user?.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
