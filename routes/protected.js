// routes/protected.js
const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    res.json({ success: true, message: `Hello ${req.user.sub}, you are authenticated!` });
});

module.exports = router;