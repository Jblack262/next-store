const express = require('express');
const app = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../middleware/tokenGeneration');

const {authenticateToken} = require('../middleware/tokenAuthenticate');

let refreshTokenDatabase = [];

app.post('/login', async (req, res, next) => { //login
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    })(req, res, next)
})
app.get('/token', authenticateToken, (req, res) => {
    const user = req.user;
    // console.log(req.user)
  res.json({ user })
})

app.post('/token', (req, res) => {
    const clientRefreshToken = req.body.token;
    
    console.log(clientRefreshToken)
    if (clientRefreshToken == null) return res.sendStatus(401);
    if (!refreshTokenDatabase.includes(clientRefreshToken)) return res.sendStatus(403);
    
    jwt.verify(clientRefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      refreshTokenDatabase.push(clientRefreshToken)
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(user);
      res.json({accessToken});
    });
})

module.exports = app;