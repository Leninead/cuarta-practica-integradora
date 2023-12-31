const CartDao = require('../dao/cart.dao');
const CartDto = require('../dto/cart.dto');

class CartService {
  static async updateCart(userId, productId, updatedQuantity) {
    try {
      const updatedCart = await CartDao.updateCart(userId, productId, updatedQuantity);
      return new CartDto(updatedCart);
    } catch (error) {
      throw error;
    }
  }

  static async removeFromCart(userId, productId) {
    try {
      const updatedCart = await CartDao.removeFromCart(userId, productId);
      return new CartDto(updatedCart);
    } catch (error) {
      throw error;
    }
  }

  static async getCartContents(userId) {
    try {
      const cartContents = await CartDao.getCartContents(userId);
      return cartContents.map(product => new CartDto(product));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;
