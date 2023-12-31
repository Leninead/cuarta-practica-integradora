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

  async updateProduct(productId, updateData, userRole) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found.');
      }

      // Check user role for product update
      if (userRole !== 'admin') {
        throw new Error('Insufficient permissions to update the product.');
      }

      // Update product data
      Object.assign(product, updateData);
      await product.save();

      return product;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw error;
    }
  }


  async deleteProduct(productId, userRole) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found.');
      }

      // Check user role for product deletion
      if (userRole !== 'admin') {
        throw new Error('Insufficient permissions to delete the product.');
      }

      // Delete the product
      await product.remove();

      return product;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = new ProductDAO();
