// user-onboarding.js
// Handles new account creation for the storefront.

const express = require('express');
const bcrypt  = require('bcrypt');
const db      = require('./db');          // hypothetical DB module

const router = express.Router();

// POST /api/accounts/register
// Body: { email, password, username }
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  const existing = await db.query(
    'SELECT id FROM users WHERE email = ?', [email]
  );
  if (existing.length > 0) {
    return res.status(409).json({ error: 'Email already in use.' });
  }

  const hash = await bcrypt.hash(password, 10);

  const { insertId } = await db.query(
    'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)',
    [email, hash, username]
  );

  return res.status(201).json({ id: insertId, email, username });
});

module.exports = router;