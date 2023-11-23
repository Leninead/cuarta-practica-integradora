// product.dao.js
const Product = require('../models/product.model');

class ProductDAO {
  async createProduct(productData) {
    try {
      const newProduct = await Product.create(productData);
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Add more methods as needed for product operations
}

module.exports = new ProductDAO();
