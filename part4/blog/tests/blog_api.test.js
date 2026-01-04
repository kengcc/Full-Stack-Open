const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  console.log('entered test')

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// test('a specific note is within the returned notes', async () => {
//   const response = await api.get('/api/notes')

//   const contents = response.body.map((note) => note.content)
//   assert.strictEqual(contents.includes('HTML is easy'), true)
// })

// test('a specific note can be viewed', async () => {
//   const notesAtStart = await helper.notesInDb()
//   const noteToView = notesAtStart[0]

//   const resultNote = await api
//     .get(`/api/notes/${noteToView.id}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   assert.deepStrictEqual(resultNote.body, noteToView)
// })

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map((n) => n.title)
  assert(contents.includes('React patterns'))
})

test('blog without likes defaults likes to zero', async () => {
  const newBlog = {
    title: 'No likes provided',
    author: 'Anonymous',
    url: 'http://nolikes.com',
  }

  const response = await api.post('/api/blogs').send(newBlog).expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is rejected with status 400', async () => {
  const newBlog = {
    author: 'Nameless Title',
    url: 'http://notitle.com',
    likes: 1,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is rejected with status 400', async () => {
  const newBlog = {
    title: 'No URL blog',
    author: 'Nameless Url',
    likes: 3,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  const ids = blogsAtEnd.map((blog) => blog.id)
  assert(!ids.includes(blogToDelete.id))
})

test('attempting to delete non-existing blog returns 404', async () => {
  const nonExisting = await helper.nonExistingId()

  await api.delete(`/api/blogs/${nonExisting}`).expect(404)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog likes count can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedLikes = blogToUpdate.likes + 5

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes })
    .expect(200)

  assert.strictEqual(response.body.likes, updatedLikes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
  assert(updatedBlog)
  assert.strictEqual(updatedBlog.likes, updatedLikes)
})

test('updating a non-existing blog returns 404', async () => {
  const nonExisting = await helper.nonExistingId()

  await api.put(`/api/blogs/${nonExisting}`).send({ likes: 1 }).expect(404)
})

after(async () => {
  await mongoose.connection.close()
})
