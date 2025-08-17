// routes/update.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

const ADMIN_KEY = process.env.ADMIN_KEY;

// Update Password (Admin)
router.post('/', async (req, res) => {
    const { username, new_password, secret_key } = req.body;

    if (secret_key !== ADMIN_KEY) {
        return res.status(401).json({ success: false, error: "Admin secret key invalid" });
    }

    try {
        const hashed = await bcrypt.hash(new_password, 10);
        db.run("UPDATE users SET hashed_password = ? WHERE username = ?", [hashed, username], function (err) {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (this.changes === 0) return res.status(404).json({ success: false, error: "User not found" });

            res.json({ success: true, message: `Password for ${username} updated successfully` });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;