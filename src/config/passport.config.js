const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/User');
const { JWT_SECRET } = require('../config/config');
const { isValidatePassword } = require('../utils');


const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  console.log('Extracted token:', token);
  return token;
};


const configurePassport = () => {
  // Local Strategy
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email: email });
  
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }
  
        const isValidPassword = isValidatePassword(password, user.password);
  
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_SECRET
  };
  
  passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      console.log('Incoming JWT Token:', jwtPayload);
  
      const user = await User.findById(jwtPayload.id);
      if (user) {
        console.log('JWT Payload:', jwtPayload);
        return done(null, user);
      } else {
        console.log('User not found for JWT Payload:', jwtPayload);
        return done(null, false);
      }
    } catch (error) {
      console.error('Error during JWT verification:', error);
      return done(error, false);
    }
  }));
};

module.exports = configurePassport;













