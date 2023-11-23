const CartDao = require('../dao/cart.dao');
const CartDto = require('../dto/cart.dto');

class CartService {
  static async updateCart(userId, productId, updatedQuantity) {
    const updatedCart = await CartDao.updateCart(userId, productId, updatedQuantity);
    return new CartDto(updatedCart);
  }

  static async removeFromCart(userId, productId) {
    const updatedCart = await CartDao.removeFromCart(userId, productId);
    return new CartDto(updatedCart);
  }

  static async getCartContents(userId) {
    const cartContents = await CartDao.getCartContents(userId);
    return cartContents.map(product => new CartDto(product));
  }
}

module.exports = CartService;
