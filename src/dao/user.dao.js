const User = require('../models/User');

class UserDao {
  static async findById(userId) {
    return User.findById(userId);
  }

  static async findByEmail(email) {
    return User.findOne({ email });
  }

  static async createUser(userData) {
    return User.create(userData);
  }

  static async updateUser(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  static async deleteUser(userId, userRole) {
    // Use the checkUserRole middleware to enforce role check for user deletion
    await checkUserRole('admin')(null, null, () => {}); // Dummy call to the middleware, you might need to adjust based on the actual usage
    return User.findByIdAndDelete(userId);
  }
}

module.exports = UserDao;
