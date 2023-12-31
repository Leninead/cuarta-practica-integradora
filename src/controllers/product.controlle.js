const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const ProductService = require('../services/product.service');
const checkUserRole = require('../middlewares/checkUserRole'); // Import the middleware

// ... Existing code ...
// Get list of products with pagination
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get individual product details
const getProductDetails = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (product) {
            res.render('product-details', { product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add a product to the cart
// Add a product to the cart
const addToCart = async (req, res) => {
    const userId = req.body.userId || req.headers['user-id'];

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const productId = req.body.productId;
    const quantity = req.body.quantity;

    try {
        let cart = await Cart.findOne({ userId });

        // Validate user role for adding to cart
        if (req.user.role !== 'admin' && req.user.role !== 'premium') {
            // For 'user' role, check if the product is already in the cart
            const isProductInCart = cart.products.some(product => product.productId === productId);
            if (isProductInCart) {
                return res.status(403).json({ message: 'Product already in the cart.' });
            }
        }

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Add the product to the cart
        cart.products.push({ productId, quantity });
        await cart.save();

        res.status(200).json({ message: 'Product added to cart.', cart });
    } catch (error) {
        console.error('Error while adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addProduct = async (req, res) => {
    // Your logic to add a product goes here
    // Make sure to handle the request and send the appropriate response
};


// Update product quantity in the cart
exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        const cart = await Cart.findOne({ userId });
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Update product quantity in the cart (alternative endpoint)
exports.updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        const cart = await Cart.findOne({ userId });
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// View the contents of the cart
exports.viewCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (cart) {
            res.status(200).json({ cartContents: cart.products });
        } else {
            res.status(404).json({ message: 'Cart not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};
// Update product quantity in the cart
const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        const cart = await Cart.findOne({ userId });
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Update product quantity in the cart (alternative endpoint)
const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        const cart = await Cart.findOne({ userId });
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// View the contents of the cart
const viewCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (cart) {
            res.status(200).json({ cartContents: cart.products });
        } else {
            res.status(404).json({ message: 'Cart not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// Remove a product from the cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ userId });

        // Validate user role for deletion
        if (req.user.role !== 'admin' && req.user.role !== 'premium') {
            // For 'user' role, check if the product belongs to the user's cart
            const isProductInCart = cart.products.some(product => product.productId === productId);
            if (!isProductInCart) {
                return res.status(403).json({ message: 'Insufficient permissions to remove the product from the cart.' });
            }
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(product => product.productId !== productId);
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    getProducts,
    getProductDetails,
    addToCart,
    addProduct,
    updateCartQuantity,
    updateQuantity,
    viewCart,
    removeFromCart
};