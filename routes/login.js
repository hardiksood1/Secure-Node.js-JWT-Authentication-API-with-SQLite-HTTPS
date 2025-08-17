// routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRE_SECONDS = parseInt(process.env.TOKEN_EXPIRE_SECONDS) || 900;

// Login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!user) return res.status(401).json({ success: false, error: "Invalid username or password" });

        const valid = await bcrypt.compare(password, user.hashed_password);
        if (!valid) return res.status(401).json({ success: false, error: "Invalid username or password" });

        const token = jwt.sign({ sub: user.username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRE_SECONDS });
        db.run("INSERT INTO tokens (user_id, token) VALUES (?, ?)", [user.id, token]);

        res.json({ success: true, access_token: token, token_type: "bearer", expires_in: TOKEN_EXPIRE_SECONDS });
    });
});

module.exports = router;