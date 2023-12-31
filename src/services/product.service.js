const ProductDao = require('../dao/product.dao');
const ProductDto = require('../dto/product.dto');

class ProductService {
  static async createProduct(productData) {
    const newProduct = await ProductDao.createProduct(productData);
    return new ProductDto(newProduct);
  }

  static async getProductById(productId) {
    const product = await ProductDao.findById(productId);
    return new ProductDto(product);
  }

  static async getAllProducts() {
    try {
      const products = await ProductDao.findAll();
      return products.map(product => new ProductDto(product));
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, updateData, userRole) {
    try {
      const updatedProduct = await ProductDao.updateProduct(productId, updateData, userRole);
      return new ProductDto(updatedProduct);
    } catch (error) {
      // Log the error or handle it based on your application's needs
      console.error('Error in updateProduct:', error);
      throw error;  // You can choose to handle the error differently
    }
  }

  static async deleteProduct(productId, userRole) {
    try {
      const deletedProduct = await ProductDao.deleteProduct(productId, userRole);
      return new ProductDto(deletedProduct);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
