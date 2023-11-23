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

  static async deleteUser(userId) {
    return User.findByIdAndDelete(userId);
  }
}

module.exports = UserDao;
