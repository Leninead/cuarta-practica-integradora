const express = require('express');
const Cart = require('../models/cart.model');


// Update product quantity in the cart
exports.updateCartQuantity = async (req, res) => {
  const { userId, productId, updatedQuantity } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    const productIndex = cart.products.findIndex(product => product.productId === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = updatedQuantity;
      await cart.save();

      return res.status(200).json({ message: 'Cart updated.' });
    } else {
      return res.status(404).json({ error: 'Product not found in the cart.' });
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        cart.products = cart.products.filter(product => product.productId !== productId);
        await cart.save();

        return res.status(200).json({ message: 'Product removed from cart.' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

// Other cart controller functions...

