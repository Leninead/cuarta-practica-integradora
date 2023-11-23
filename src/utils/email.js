

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
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject: 'Password Reset',
    html: `<p>Click the following link to reset your password:</p>
           <a href="http://your-app/reset-password/${resetToken}">Reset Password</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
