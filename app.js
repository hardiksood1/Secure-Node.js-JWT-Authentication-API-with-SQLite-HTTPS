// app.js
require('dotenv').config();
const fs = require('fs');
const express = require('express');

const userRoute = require('./routes/user');
const updateRoute = require('./routes/update');
const loginRoute = require('./routes/login');
const protectedRoute = require('./routes/protected');
const logoutRoute = require('./routes/logout');

const app = express();
app.use(express.json());

// Your app routes...
app.use('/user', userRoute);
app.use('/update_password', updateRoute);
app.use('/login', loginRoute);
app.use('/protected', protectedRoute);
app.use('/logout', logoutRoute);

app.get('/', (req, res) => res.send('✅ API is running...'));

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync('certs/server.key'),
  cert: fs.readFileSync('certs/server.crt')
};

const https = require('https');
const httpsPort = process.env.HTTPS_PORT || 443;

// Start HTTPS server
https.createServer(sslOptions, app).listen(httpsPort, () => {
  console.log(`✅ HTTPS server running at https://localhost:${httpsPort}`);
});