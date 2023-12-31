const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  generatePasswordResetToken,
  resetPassword,
  loginUser,
  registerUser,
  logoutUser,
  adminDashboard,
  getCurrentSessionUser,
  changeUserRole,

} = require('../controllers/user.controller');

// Import the middlewares
const authenticateUser = require('../authenticateUser');

// Route to handle user login
router.post('/login', (req, res) => loginUser(req, res));

// Route to handle user logout
router.get('/logout', (req, res) => logoutUser(req, res));

// Admin dashboard route
router.get('/admin-dashboard', authenticateUser, (req, res) => adminDashboard(req, res));

// Registration Page
router.post('/register', (req, res) => registerUser(req, res));

// Password reset request and reset routes
router.post('/reset-password-request', (req, res) => generatePasswordResetToken(req, res));
router.post('/reset-password/:token', (req, res) => resetPassword(req, res));

// Get current user based on JWT token
router.get('/api/sessions/current', (req, res) => getCurrentSessionUser(req, res));

// Change user role route
router.put('/:uid/premium', changeUserRole);


module.exports = router;
