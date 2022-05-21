const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const nextConfig = {
  reactStrictMode: true,
}

const app = next({ dev, hostname, port, nextConfig });
const handle = app.getRequestHandler();


app.prepare().then(() => {
  const server = express();

  server.use(express.json())
  require('dotenv').config()
  
  const passport = require('passport');
  require('./middleware/passport')(passport)
  const session = require("express-session");

  server.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(express.json({ limit: '16MB' }));
  server.use(express.urlencoded({ extended: true }));
  
  const connectDB = require('./lib/dbConnect');

  server.use('/api/user', require('./api/auth'));

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        server.listen(port, console.info(`server is listening on port ${port}`));
    } catch (error) { console.log(error) }
  }
  start();
});