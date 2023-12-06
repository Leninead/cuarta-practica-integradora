
/*
Consigna

Continuar sobre el proyecto que has trabajado para tu ecommerce y configurar los siguientes elementos:

Aspectos a incluir

*Crear un modelo User el cual contará con los campos:
-first_name:String,
-last_name:String,
-email:String (único)
-age:Number,
-password:String(Hash)
-cart:Id con referencia a Carts
-role:String(default:’user’)
*Desarrollar las estrategias de Passport para que funcionen con este modelo de usuarios
*Modificar el sistema de login del usuario para poder trabajar con session o con jwt (a tu elección). 
*(Sólo para jwt) desarrollar una estrategia “current” para extraer la cookie que contiene el token para obtener el usuario asociado a dicho token, en caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, utilizar un extractor de cookie.
*Agregar al router /api/sessions/ la ruta /current, la cual utilizará el modelo de sesión que estés utilizando, para poder devolver en una respuesta el usuario actual.


practicaintegracionecommerce
{
  "firstName": "lenin",
  "lastName": "acosta",
  "email": "lenin@example.com",
  "age": 36,
  "password": "password12456"
}
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWI0NGU5N2JiNTFjYTVlYThiZTkxMCIsImlhdCI6MTY5NjI4NTkyOSwiZXhwIjoxNjk2Mjg5NTI5fQ.xdK3sN9VxBMV8nUUdEOPFtXfzxSIP3bE0J0DTZqir0c"
}

mongodb+srv://leninacosta2107:practicaintegracionecommerce@cluster0.vxjntdf.mongodb.net/?retryWrites=true&w=majority




1)User Model and Authentication:

Create a User model and ensure it has the required fields: first_name, last_name, email, age, password, cart (reference to Carts), role.

2)Passport Strategies and Authentication:

Implement Passport strategies for user authentication.
Ensure that you have strategies for local login (username and password) and JWT authentication.
Implement a "current" strategy for JWT to extract the user from the token.

3)Login System:

Modify the login system to handle both session-based and JWT-based authentication.
Update the login endpoint to issue a JWT token upon successful authentication.

4)Cart Model and Endpoints:

You've created the cart.model.js, but ensure that the Cart model has the necessary fields and associations as per the requirements (userId, products, etc.).
Implement endpoints to handle cart management: adding, updating, deleting products from the cart.

5)Database Integration:

Integrate MongoDB as the primary persistence system for your application.
Create the necessary MongoDB collections (Users, Products, Carts) to store data as per the requirements.

6)Products Endpoints:

Update the products router (products.router.js) to include endpoints for:
Handling product listing with pagination, filtering, and sorting.
Viewing individual product details.

7)Views:

Create views to display products and allow users to interact with the application (e.g., view product details, add to cart).

8)Role Implementation:

Implement a system of roles, where certain users have admin privileges.

Logout Functionality:

Implement a "logout" mechanism to destroy the session and redirect to the login view.
To summarize, ensure you have implemented the user model, authentication strategies, endpoints for cart management, integrated MongoDB with the necessary collections, and updated the products router with the required endpoints. Additionally, implement views to interact with the application and consider role-based access as needed.

TASTING USING POSTMAN User Endpoints:

1)Register a new user.
Log in with the registered user.
Test the "current user" endpoint.

2)Cart Endpoints:
Add products to the cart.
Update product quantities in the cart.
Remove products from the cart.
View the cart contents.

3)Product Endpoints:
Retrieve a list of products.
View details of individual products.

4)Admin Endpoint:
Access the admin dashboard (if applicable).

5)Logout Endpoint:
Test the logout functionality.


{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe222@example.com",
  "age": 30,
  "password": "doe222"
}

admin
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MjMwMjgwZGNlOWNjZDA5MWZmZWFhNiIsImlhdCI6MTY5Njc5MzIxNiwiZXhwIjoxNjk2Nzk2ODE2fQ.KSluVlnu25PylCs_gIUsToGTITrk8evUAghWud3dlsI
}
Authorization
Certainly! Here are the Postman paths for the endpoints in your provided code:

1)List Products with Pagination, Filtering, and Sorting (GET):

Method: GET
Path: http://localhost:8080/products
Query Parameters:
page: (Optional) Page number for pagination
limit: (Optional) Limit for pagination

2)View Individual Product Details (GET):

Method: GET
Path: http://localhost:8080/products/{productId}
Replace {productId} with the actual product ID you want to view

3)Add Product to Cart (POST):

Method: POST
Path: http://localhost:8080/products/add-to-cart
Request Body (JSON):
json
Copy code
{
  "productId": "product_id_here",
  "quantity": 1
}
Replace "product_id_here" with the actual product ID you want to add to the cart.

4)Update Product Quantity in Cart (PUT):

Method: PUT
Path: http://localhost:8080/products/update-cart/{productId}
Replace {productId} with the actual product ID you want to update in the cart
Request Body (JSON):
json
Copy code
{
  "quantity": 2
}
Replace 2 with the updated quantity.

5)Update Product Quantity in Cart using Quantity Endpoint (PUT):

Method: PUT
Path: http://localhost:8080/products/update-quantity/{productId}
Replace {productId} with the actual product ID you want to update the quantity
Request Body (JSON):
json
Copy code
{
  "quantity": 3
}
Replace 3 with the updated quantity.

6)View Cart Contents (GET):

Method: GET
Path: http://localhost:8080/products/view-cart

7)Remove Product from Cart (DELETE):

Method: DELETE
Path: http://localhost:8080/products/remove-from-cart/{productId}
Replace {productId} with the actual product ID you want to remove from the cart.
Make sure to replace {productId} and "product_id_here" with the actual product IDs you want to use. Also, adjust the base URL (http://localhost:8080) if your server is running on a different port or domain.



{
    
    "email": "leninadmin@example.com",
    "password": "adminpassword"

}

*/
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const configurePassport = require('./config/passport.config');
const usersRouter = require('./routes/users.router');
const { JWT_SECRET } = require('./config/config'); // Ensure you have a config file for your JWT secret
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const productsRouter = require('./routes/products.router');
const cartRoutes = require('./routes/cart.router');
const authenticateUser = require('./authenticateUser');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

const connectDB = require('./db');
connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// In app.js
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Send a meaningful error response
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
