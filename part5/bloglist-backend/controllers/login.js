const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // updated: below issue is because i used different password when creating the user
  // !! course provided passwordHash for user mluukkai is obsolete,
  // have to manually update user's passowrdHash field in database first!!
  // user console.log below to get new hash, then update mongodb table
  // console.log('password', password)
  // console.log('bcrypt password', await bcrypt.hash(password, 10))
  // console.log('passwordHash', user.passwordHash)
  // console.log('passwordCorrect', passwordCorrect)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // remember to add SECRET in .env
  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
