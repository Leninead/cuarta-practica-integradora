const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { User } = require('../models/User');
const generateAuthToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, age, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      age,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' role if not provided
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token using the new function
    const token = generateAuthToken(newUser._id, newUser.role);

    // Return the token to the client
    return res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration: ', error);
    return res.status(500).send('Internal server error');
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Passport authentication error:', err);
      return next(err);
    }

    if (!user) {
      console.error('User not found in passport authentication:', info);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Log the decoded user information
    console.log('Decoded user:', user);

    // Generate JWT token using the new function
    const token = generateAuthToken(user._id, user.role);

    // Return the token to the client
    return res.status(200).json({ token });
  })(req, res, next);
};

exports.getCurrentSessionUser = (req, res) => {
  const token = req.cookies['connect.sid'];
  console.log('Token in getCurrentSessionUser:', token);

  if (!token) {
    return res.status(401).json({ message: 'No JWT token found' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    console.log('Decoded token:', decoded);
    if (err) {
      console.error('Error during JWT verification:', err);
      return res.status(401).json({ message: 'Invalid JWT token' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(401).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
};


exports.logoutUser = async (req, res) => {
  console.log('Logout initiated.');
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal server error');
    }
    console.log('Session destroyed.');
    res.redirect('/');
  });
};

exports.adminDashboard = async (req, res) => {
  console.log('Request received for admin dashboard:', req.user);
  try {
    // Instead of directly checking user.role, use the req.user object provided by passport
    if (req.user.role === 'admin') {
      return res.status(200).send('Welcome to the admin dashboard.');
    } else {
      return res.status(403).send('Access denied. Only admins allowed.');
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Internal server error.');
  }
};


exports.generatePasswordResetToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error generating password reset token:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.requestPasswordRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error generating password reset token:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
exports.processPasswordRecovery = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find the user by the password reset token
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token.' });
    }

    // Check if the reset token has expired (consider using a timestamp)
    // For example, you can compare the current time with the token creation time

    // Reset password and clear reset token
    user.password = newPassword;
    user.passwordResetToken = undefined;

    // Save the user document with the new password and cleared token
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token.' });
    }

    // Reset password and clear reset token
    user.password = newPassword;
    user.passwordResetToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



// Change user role

exports.changeUserRole = async (req, res) => {
  // ... existing code for changing user role ...

  // Include the new logic for upgrading to premium based on completed documents
  const { uid } = req.params;
  const { role } = req.body;

  // Use the checkUserRole middleware to enforce role checks
  try {
    await checkUserRole('admin')(req, res, async () => {
      // If the middleware allows, proceed with changing the user role
      // Check if the provided role is valid
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role.' });
      }

      try {
        const user = await User.findById(uid);

        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }

        // Upgrade to premium logic
        if (areDocumentsComplete(user.documents)) {
          await upgradeUserToPremium(user._id);
          return res.status(200).json({ message: 'User upgraded to premium.' });
        } else {
          return res.status(400).json({ error: 'Incomplete documents. Upgrade to premium requires completed documents.' });
        }
      } catch (error) {
        console.error('Error changing user role:', error);
        return res.status(500).json({ error: 'Internal server error.' });
      }
    });
  } catch (error) {
    console.error('Error during role check:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// New logic for upgrading to premium based on completed documents
exports.upgradeUserToPremium = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if documents are complete
    if (areDocumentsComplete(user.documents)) {
      // Upgrade user to premium
      await upgradeUserToPremium(user._id);
      return res.status(200).json({ message: 'User upgraded to premium' });
    } else {
      return res.status(400).json({ error: 'Incomplete documents. Upgrade to premium requires completed documents.' });
    }
  } catch (error) {
    console.error('Error upgrading user to premium:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to check if documents are complete
function areDocumentsComplete(documents) {
  return documents && documents.length > 0;
}

// Helper function to upgrade user to premium
async function upgradeUserToPremium(userId) {
  try {
    // Add logic to update the user's role to "premium"
    await User.findByIdAndUpdate(userId, { role: 'premium' });
  } catch (error) {
    console.error('Error upgrading user to premium:', error);
    throw error; // Propagate the error
  }
}

// Example user service method to update user role
async function updateUserRole(userId, newRole) {
  try {
    // Implement your logic to update the user's role in the database
    await User.findByIdAndUpdate(userId, { role: newRole });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error; // Propagate the error
  }
}

module.exports = exports;
