// routes/logout.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Logout (delete token from DB)
router.post('/', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(400).json({ success: false, error: "No token provided" });

    db.run("DELETE FROM tokens WHERE token = ?", [token], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (this.changes === 0) return res.status(404).json({ success: false, error: "Token not found" });

        res.json({ success: true, message: "Logged out successfully" });
    });
});

module.exports = router;