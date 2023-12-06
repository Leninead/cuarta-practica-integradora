const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendPasswordResetEmail } = require('../utils/email');
const UserService = require('../services/user.service');
const validRoles = require('../utils/roles'); // Add this line
const saltRounds = 10;
const { JWT_SECRET } = require('../config/config');
const generateAuthToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, JWT_SECRET, { expiresIn: '1h' });
};


exports.getCurrentSessionUser = (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No JWT token found' });
  }

  jwt.verify(token.split(' ')[1], JWT_SECRET, async (err, decoded) => {
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

// ... (rest of your code)

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, age, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = { firstName, lastName, email, age, password: hashedPassword, role };
    const newUserDto = await UserService.createUser(userData);

    // Generate JWT token using the new function
    const token = generateAuthToken(newUserDto._id, newUserDto.role);

    // Return the token to the client
    return res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration: ', error);
    return res.status(500).send('Internal server error');
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request for email:', email);

  try {
    const user = await User.findOne({ email });

    console.log('User found:', user);

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'User not found.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log('Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Incorrect password for email:', email);
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    console.log('Login successful for email:', email);
    return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
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
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User role:', user.role);

    if (user.role === 'admin') {
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
  const { uid } = req.params;
  const { role } = req.body;

  // Check if the provided role is valid
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  try {
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'User role updated.' });
  } catch (error) {
    console.error('Error changing user role:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


module.exports = exports;
