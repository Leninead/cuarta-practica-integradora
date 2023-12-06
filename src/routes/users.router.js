const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generatePasswordResetToken, resetPassword, loginUser, registerUser, logoutUser, adminDashboard, getCurrentSessionUser, changeUserRole } = require('../controllers/user.controller');

router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Registration Page
router.post('/register', registerUser);

// Password reset request and reset routes
router.post('/reset-password-request', generatePasswordResetToken);
router.post('/reset-password/:token', resetPassword);

// Admin dashboard route
router.get('/admin-dashboard', passport.authenticate('jwt', { session: false }), adminDashboard);

// Get current user based on JWT token
router.get('/api/sessions/current', getCurrentSessionUser);

// Change user role route
router.put('/premium/:uid', changeUserRole);

module.exports = router;
