const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// PUT endpoint to update product quantity in the cart
router.put('/update-cart/:productId', cartController.updateCart);

// DELETE endpoint to remove a product from the cart
router.delete('/remove-from-cart/:productId', cartController.removeFromCart);

module.exports = router;
