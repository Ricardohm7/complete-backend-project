const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  console.log(cookies.jwt)
  const rfToken = cookies.jwt

  const foundUser = usersDB.users.find(person => person.refreshToken === rfToken)
  if (!foundUser) return res.sendStatus(403) //Forbidden
  //evaluate jwt
  jwt.verify(
    rfToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403)
      console.log('sign new token...')
      const accessToken = jwt.sign(
        { "username": decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      )
      console.log('sending token')
      res.json({ accessToken })
    }
  )
}

module.exports = { handleRefreshToken }