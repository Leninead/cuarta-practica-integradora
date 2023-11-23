const express = require('express');
const router = express.Router();
const CartService = require('../services/cart.service');

router.put('/update-cart/:productId', async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    const updatedQuantity = req.body.quantity;

    const updatedCartDto = await CartService.updateCart(userId, productId, updatedQuantity);

    return res.status(200).json(updatedCartDto);
  } catch (error) {
    console.error('Error updating quantity:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

router.delete('/remove-from-cart/:productId', async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const updatedCartDto = await CartService.removeFromCart(userId, productId);

    return res.status(200).json(updatedCartDto);
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add other routes using CartService as needed

module.exports = router;
