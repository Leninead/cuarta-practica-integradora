// Import necessary modules and controllers
const express = require('express');
const router = express.Router();
const documentsRouter = require('./documents.router');
const authenticateUser = require('../authenticateUser');
const checkUserRole = require('../middlewares/checkUserRole');
const documentsController = require('../controllers/documents.controller');

// Import user controller functions
const {
  generatePasswordResetToken,
  resetPassword,
  loginUser,
  registerUser,
  logoutUser,
  adminDashboard,
  getCurrentSessionUser,
} = require('../controllers/user.controller');

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

// Create an endpoint to handle premium user upgrade
router.post('/premium/:uid', checkUserRole('premium'), (req, res) => {
  documentsController.upgradeToPremium(req, res);
});

// Create an endpoint to handle document upload
router.post('/:uid/documents', (req, res) => {
  documentsController.uploadDocuments(req, res);
});

// Change user role route
router.use('/premium/:uid', checkUserRole('premium'), (req, res) => {
  documentsController.someFunction(req, res);
}, documentsRouter);

module.exports = router;
