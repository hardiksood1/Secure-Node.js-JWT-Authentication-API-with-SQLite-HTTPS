// http-redirected.js
const express = require('express');
const app = express();

// Redirect all traffic to HTTPS
app.use((req, res, next) => {
  // Redirect only if not secure
  if (!req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

app.get('*', (req, res) => {
  res.send('Redirecting to HTTPS...');
});

const PORT = 80;
app.listen(PORT, () => {
  console.log(`HTTP redirect server running on port ${PORT}`);
});