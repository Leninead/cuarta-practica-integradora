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
    const products = await ProductDao.findAll();
    return products.map(product => new ProductDto(product));
  }

  static async updateProduct(productId, updateData) {
    const updatedProduct = await ProductDao.updateProduct(productId, updateData);
    return new ProductDto(updatedProduct);
  }

  static async deleteProduct(productId) {
    const deletedProduct = await ProductDao.deleteProduct(productId);
    return new ProductDto(deletedProduct);
  }
}

module.exports = ProductService;
