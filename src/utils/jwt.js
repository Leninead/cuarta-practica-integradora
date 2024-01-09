// utils/jwt.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

function generateAuthToken(userId, userRole) {
  return jwt.sign({ id: userId, role: userRole }, JWT_SECRET, { expiresIn: '1h' });
}

function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateAuthToken, verifyAuthToken };
