const express = require('express');
const app = express.Router();
const passport = require('passport');

const {authenticateToken} = require('../middleware/tokenAuthenticate');

app.post('/login', async (req, res, next) => { //login
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    })(req, res, next)
})
app.get('/token', authenticateToken, (req, res) => {
  res.json({ msg: "token authorized" })
})

module.exports = app;