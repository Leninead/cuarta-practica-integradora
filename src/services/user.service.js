const UserDao = require('../dao/user.dao');
const UserDto = require('../dto/user.dto');
const checkUserRole = require('../middlewares/checkUserRole'); 

class UserService {
  static async createUser(userData) {
    const newUser = await UserDao.createUser(userData);
    return new UserDto(newUser);
  }

  static async getUserById(userId) {
    const user = await UserDao.findById(userId);
    return new UserDto(user);
  }

  static async getUserByEmail(email) {
    const user = await UserDao.findByEmail(email);
    return new UserDto(user);
  }
  static async updateUser(userId, updateData, userRole) {
    try {

      
      // Use the checkUserRole middleware to enforce role check for user update
      await checkUserRole(userRole)(req, res, next);
      const updatedUser = await UserDao.updateUser(userId, updateData);
      return new UserDto(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;  // You can choose to handle the error differently
    }
  }
  static async deleteUser(userId, userRole) {
    try {
      // Use the checkUserRole middleware to enforce role check for user deletion
      await checkUserRole(userRole)(req, res, next);
      const deletedUser = await UserDao.deleteUser(userId);
      return new UserDto(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;  // You can choose to handle the error differently
    }
  }
}  
module.exports = UserService;
