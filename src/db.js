
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config/config');

const connectDB = async () => {
  try {
    const uri = MONGODB_URI || 'mongodb+srv://leninacosta2107:practicaintegracionecommerce@cluster0.vxjntdf.mongodb.net/?retryWrites=true&w=majority';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Throw an error or handle it based on your requirements
    throw new Error('Failed to connect to the database');
  }
};

module.exports = connectDB;
