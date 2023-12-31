const express = require('express');
const Cart = require('../models/cart.model');



// Middleware for checking user role
const checkUserRole = (requiredRole) => (req, res, next) => {
  if (req.user.role === requiredRole || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Insufficient permissions' });
};

// Update product quantity in the cart
exports.updateCartQuantity = async (req, res) => {
  const { userId, productId, updatedQuantity } = req.params;

  try {
    // Apply the checkUserRole middleware for user role validation
    await checkUserRole('premium')(req, res, () => {}); // Example usage

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
    // Apply the checkUserRole middleware for user role validation
    await checkUserRole('premium')(req, res, () => {}); // Example usage

    const cart = await Cart.findOne({ userId });
    cart.products = cart.products.filter(product => product.productId !== productId);
    await cart.save();

    return res.status(200).json({ message: 'Product removed from cart.' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Add a product to the cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.params;

  try {
    // Apply the checkUserRole middleware for user role validation
    await checkUserRole('premium')(req, res, () => {}); // Example usage

    const cart = await Cart.findOne({ userId });
    const productIndex = cart.products.findIndex(product => product.productId === productId);

    if (productIndex !== -1) {
      // Product already exists in the cart, update quantity
      cart.products[productIndex].quantity += parseInt(quantity);
    } else {
      // Product doesn't exist in the cart, add it
      cart.products.push({ productId, quantity: parseInt(quantity) });
    }

    await cart.save();

    return res.status(200).json({ message: 'Product added to cart.' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get the user's cart
exports.getUserCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Apply the checkUserRole middleware for user role validation
    await checkUserRole('premium')(req, res, () => {}); // Example usage

    const cart = await Cart.findOne({ userId });

    return res.status(200).json({ cart });
  } catch (error) {
    console.error('Error getting user cart:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Clear the user's cart
exports.clearUserCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Apply the checkUserRole middleware for user role validation
    await checkUserRole('premium')(req, res, () => {}); // Example usage

    const cart = await Cart.findOne({ userId });
    cart.products = [];
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared.' });
  } catch (error) {
    console.error('Error clearing user cart:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
// Other cart controller functions...

