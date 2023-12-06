const passport = require('passport');
const authenticateUser = passport.authenticate('jwt', { session: false });

module.exports = (req, res, next) => {
  authenticateUser(req, res, async (err, user, info) => {
    try {
      if (err) {
        console.error('Passport authentication error:', err);
        return next(err);
      }

      if (!user) {
        console.error('User not found in passport authentication:', info);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Set the user in the request object
      req.user = user;

      console.log('Authentication successful. User:', user);
      // Debugging logs
      console.log('Request headers:', req.headers);

      return next(); // Make sure to call next() after successful authentication
    } catch (error) {
      console.error('Error during JWT verification:', error);
      return res.status(401).json({ message: 'Invalid JWT token' });
    }
  });
};
