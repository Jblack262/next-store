const jwt = require('jsonwebtoken');
// require('dotenv').config() 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]//if there is an authHeader then split it and if not return null
  //Bearer TOKEN
  if (token == null) return res.sendStatus(401)//No token - no authHeader
  //now verify token is valid
  console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(200).json({msg: "invalid token"}) //invalid token no access token
    // console.log(user)
    req.user = user;
    next();
  })
}

module.exports = { authenticateToken }