const express = require('express');
const router = express.Router();
const { getProducts, getProductDetails, addProduct, addToCart, updateCartQuantity, updateQuantity, viewCart, removeFromCart } = require('../controllers/product.controlle');

// Add this line
const ProductService = require('../services/product.service');

// Route to handle product listing with pagination, filtering, and sorting
router.get('/', getProducts);

// Route to view individual product details
router.get('/:productId', getProductDetails);

// Route to add a product
router.post('/add-product', addProduct);

// Route to add a product to the cart
router.post('/add-to-cart', addToCart);

// Route to update product quantity in the cart
router.put('/update-cart/:productId', updateCartQuantity);

// Alternative route to update product quantity in the cart
router.put('/update-quantity/:productId', updateQuantity);

// Route to view the contents of the cart
router.get('/view-cart', viewCart);

// Route to remove a product from the cart
router.delete('/remove-from-cart/:productId', removeFromCart);

// Other routes...

module.exports = router;
