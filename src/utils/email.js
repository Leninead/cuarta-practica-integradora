const nodemailer = require('nodemailer');
const { EMAIL_USERNAME, EMAIL_PASSWORD } = require('../config/config');

// Create a nodemailer transporter with your email provider settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

// Function to send a password reset email
exports.sendPasswordResetEmail = async (to, resetToken) => {
  // Include a timestamp in the reset token
  const timestamp = Date.now();
  const resetTokenWithTimestamp = `${resetToken}_${timestamp}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject: 'Password Reset',
    html: `<p>Click the following link to reset your password:</p>
           <a href="http://your-app/reset-password/${resetTokenWithTimestamp}">Reset Password</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// Function to validate the reset token and check expiration
exports.validateResetToken = (resetToken) => {
  // Extract timestamp from the reset token
  const parts = resetToken.split('_');
  const timestamp = parseInt(parts[1], 10);

  // Define the expiration duration (1 hour in milliseconds)
  const expirationDuration = 1 * 60 * 60 * 1000; // 1 hour

  // Check if the token has expired
  const isTokenExpired = Date.now() - timestamp > expirationDuration;

  return !isTokenExpired;
};
