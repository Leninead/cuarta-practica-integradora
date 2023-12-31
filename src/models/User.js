const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'], // Add 'premium' role
    default: 'user',
  },
  documents: [
    {
      name: String,
      reference: String,
    }
  ],
  last_connection: {
    type: Date,
    default: null,
  },
});

userSchema.methods.generateJWT = function () {
  try {
    const token = jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated JWT:', token);
    return token;
  } catch (error) {
    throw new Error('Error generating JWT: ' + error.message);
  }
};

module.exports = mongoose.model('User', userSchema);
