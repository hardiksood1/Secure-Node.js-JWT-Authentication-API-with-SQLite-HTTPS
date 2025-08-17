// routes/user.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

const ADMIN_KEY = process.env.ADMIN_KEY;

// Add User (Admin)
router.post('/add', async (req, res) => {
    const { username, password, secret_key } = req.body;

    if (secret_key !== ADMIN_KEY) {
        return res.status(401).json({ success: false, error: "Admin secret key invalid" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username, hashed_password) VALUES (?, ?)", [username, hashed], function (err) {
            if (err) return res.status(400).json({ success: false, error: "User already exists" });
            res.json({ success: true, message: `User ${username} added successfully` });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;