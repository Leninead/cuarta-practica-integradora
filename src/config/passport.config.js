const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/User');
const { JWT_SECRET } = require('../config/config');
const { isValidatePassword } = require('../utils');


const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt']; // assuming your cookie is named 'jwt'
  }
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
// JWT Strategy
const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    console.log('JWT Payload:', jwtPayload); // Log the payload

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


  // Serialize and deserialize user for session management
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      let user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = configurePassport;













