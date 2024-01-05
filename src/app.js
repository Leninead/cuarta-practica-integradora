
/*
Based on the task requirements, you need to:

1)Move the route /api/users/premium/:uid to a specific router for users at /api/users/.
2)Modify the User model to include a new property "documents" as an array of objects.
3)Add a property to the User model called "last_connection" to be updated on login and logout.
4)Create an endpoint /api/users/:uid/documents with the POST method for uploading one or multiple files.
5)Use Multer middleware to handle file uploads, saving files in different folders based on the file type.
6)Update the endpoint /api/users/premium/:uid to only upgrade the user to premium if specific documents are uploaded.
To proceed, please share the code snippets or files related to these modifications. Specifically, the code for the router modifications, User model changes, the new endpoint for uploading documents, and the logic for checking uploaded documents before upgrading to premium. If you have any questions or face challenges in any specific part, let me know.
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const configurePassport = require('./config/passport.config');
const usersRouter = require('./routes/users.router');
const userRouter = require('./routes/user.router'); // Import the new user router
const { JWT_SECRET } = require('./config/config');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const productsRouter = require('./routes/products.router');
const cartRoutes = require('./routes/cart.router');
const authenticateUser = require('./authenticateUser');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
require('dotenv').config();
const logger = require('./utils/logger');
const documentsRouter = require('./routes/documents.router');
const app = express();

const connectDB = require('./db');
connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the documents router for the documents-related routes under the /api/users path
app.use('/api/users', documentsRouter);

// Use the user router for user-related routes under the /api/users path
app.use('/api/users', userRouter);

// Configure Passport
app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
configurePassport();
// Use cookie parser
app.use(cookieParser());

// Use the authentication middleware
app.use(authenticateUser);

// Use helmet for security
app.use(helmet());

// Authentication Routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Use the cart routes
app.use('/cart', cartRoutes);

// JWT Authentication Route
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => {
      if (req && req.cookies) {
        return req.cookies['jwt']; // Replace 'your-cookie-name' with 'jwt'
      }
      return null;
    },
  ]),
  secretOrKey: JWT_SECRET,
};
passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Send a meaningful error response
  res.status(500).json({ error: 'Internal Server Error' });
});

logger.info('Server started!');

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
