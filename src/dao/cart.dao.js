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

  async updateCart(userId, productId, updatedQuantity) {
    try {
      const cart = await Cart.findOne({ userId });
      const productIndex = cart.products.findIndex(product => product.productId === productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = updatedQuantity;
        await cart.save();
        return cart;
      } else {
        throw new Error('Product not found in the cart.');
      }
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(userId, productId) {
    try {
      const cart = await Cart.findOne({ userId });
      cart.products = cart.products.filter(product => product.productId !== productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartDAO();
