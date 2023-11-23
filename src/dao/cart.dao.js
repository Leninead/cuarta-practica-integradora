
const Cart = require('../models/cart.model');

class CartDAO {
  async getCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cart) {
    try {
      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  // Add more methods as needed for cart operations
}

module.exports = new CartDAO();
