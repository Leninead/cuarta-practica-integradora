// src/routes/cart.router.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticateUser = require('../authenticateUser'); // Import the authenticateUser middleware
const checkUserRole = require('../middlewares/checkUserRole');

// Update product quantity in the cart
router.put('/update-cart/:userId/:productId/:updatedQuantity', authenticateUser, checkUserRole('premium'), cartController.updateCartQuantity);

// Remove a product from the cart
router.delete('/remove-from-cart/:userId/:productId', checkUserRole('premium'), cartController.removeFromCart);

// Add a product to the cart
router.post('/add-to-cart/:userId/:productId/:quantity', checkUserRole('premium'), cartController.addToCart);

// Get the user's cart
router.get('/get-cart/:userId', checkUserRole('premium'), cartController.getUserCart);

// Clear the user's cart
router.delete('/clear-cart/:userId', checkUserRole('premium'), cartController.clearUserCart);

// Other routes...

module.exports = router;
