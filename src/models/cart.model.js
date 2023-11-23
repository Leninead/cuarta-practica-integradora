const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartCollectionName = "carts"; // Collection name

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1 // Set default quantity to 1
        }
    }]
});

// Add pagination plugin to the cart schema
cartSchema.plugin(mongoosePaginate);

let Cart;

try {
    // Try to get existing model
    Cart = mongoose.model('Cart');
} catch (error) {
    // If the model doesn't exist, create it
    Cart = mongoose.model('Cart', cartSchema, cartCollectionName);
}

module.exports = Cart;
