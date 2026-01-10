const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation fails with proper status and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username must be unique/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short User',
      password: 'validpass',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username must be at least 3 characters long/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails if password is missing or shorter than 3 characters', async () => {
    const shortPasswordUser = {
      username: 'validUser',
      name: 'Short Password',
      password: 'pw',
    }

    const missingPasswordUser = {
      username: 'validUser2',
      name: 'Missing Password',
    }

    const shortPasswordResult = await api
      .post('/api/users')
      .send(shortPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(
      shortPasswordResult.body.error,
      /password must be at least 3 characters long/
    )

    const missingPasswordResult = await api
      .post('/api/users')
      .send(missingPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(
      missingPasswordResult.body.error,
      /password must be at least 3 characters long/
    )

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
