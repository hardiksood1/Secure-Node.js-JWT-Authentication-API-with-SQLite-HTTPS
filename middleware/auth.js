// middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, error: "Invalid or expired token" });

        // Check if token exists in DB
        db.get("SELECT * FROM tokens WHERE token = ?", [token], (dberr, row) => {
            if (dberr) return res.status(500).json({ success: false, error: dberr.message });
            if (!row) return res.status(401).json({ success: false, error: "Session not found" });

            req.user = user;
            next();
        });
    });
}

module.exports = authenticateToken;