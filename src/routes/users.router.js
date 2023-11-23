const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generatePasswordResetToken, resetPassword, loginUser, registerUser, logoutUser, adminDashboard, getCurrentSessionUser, changeUserRole } = require('../controllers/user.controller');

// Password reset request route
router.post('/reset-password-request', generatePasswordResetToken);

// Password reset route
router.post('/reset-password/:token', resetPassword);

router.get('/', (req, res) => {
  res.render('home');
});

// Registration Page
router.post('/register', registerUser);

router.post('/login', loginUser);

// Logout route
router.get('/logout', logoutUser);

// Admin dashboard route
router.get('/admin-dashboard', passport.authenticate('jwt', { session: false }), adminDashboard);

// Get current user based on JWT token
router.get('/api/sessions/current', getCurrentSessionUser);

// Change user role route
router.put('/change-role/:uid', changeUserRole);

// Other routes...

module.exports = router;
