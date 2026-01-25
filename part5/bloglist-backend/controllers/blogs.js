const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const { id } = request.params
    const user = request.user

    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (!blog.user || blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: 'only creator can delete blog' })
    }

    await Blog.findByIdAndDelete(id)
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== blog._id.toString(),
    )
    await user.save()

    return response.status(204).end()
  },
)

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', { username: 1, name: 1 })

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  return response.json(updatedBlog)
})

module.exports = blogsRouter
