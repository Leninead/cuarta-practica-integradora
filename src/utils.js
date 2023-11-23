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
  }
};

module.exports = connectDB;

/*
Certainly! Let's review each file:

1)src/config/config.js:

Consider using environment variables for sensitive information like the JWT_SECRET instead of hardcoding it.
Update it to use environment variables if applicable.

2)src/config/passport.config.js:

Looks good; it sets up Passport with a local and JWT strategy.
Make sure that the cookie name ('jwt') aligns with what is used in your application.
The cookieExtractor function extracts the JWT from cookies, which seems fine.

3)src/authenticateUser.js:

This middleware sets req.user based on the 'user-id' header. It's a basic way of identifying the user for further requests.
Ensure that this aligns with your authentication strategy; if it meets your needs, it seems fine.

4)src/cart.js:

This file appears to contain functions related to updating and removing items from the cart. It seems to interact with a REST API.
If this logic is not needed or is duplicated with the logic in your cart.router.js and controllers, you might consider removing this file.
Ensure that this file aligns with your current architecture.

5)src/db.js:

It connects to MongoDB using Mongoose. The connection string is hardcoded; consider using environment variables.
This file is reasonable for connecting to the database. If this approach suits your needs, it's fine.

6)src/utils.js:

It seems like a copy of src/db.js. If this is intended to be a utility function, you might want to move it to a utils folder.
Make sure there is no redundancy with other utility files or functions.
Based on the task requirements and best practices, you might want to consider:

Using environment variables for sensitive information.
Ensuring that files are organized, and utility functions are placed in appropriate folders.
Removing redundant or unnecessary files.
Feel free to make adjustments based on your application's specific needs and organization preferences.




*/