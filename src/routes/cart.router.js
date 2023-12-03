const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Update product quantity in the cart
router.put('/update-cart/:userId/:productId/:updatedQuantity', cartController.updateCartQuantity);

// Remove a product from the cart
router.delete('/remove-from-cart/:userId/:productId', cartController.removeFromCart);

// Other routes...

module.exports = router;
