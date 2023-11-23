const UserDao = require('../dao/user.dao');
const UserDto = require('../dto/user.dto');

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

  static async updateUser(userId, updateData) {
    const updatedUser = await UserDao.updateUser(userId, updateData);
    return new UserDto(updatedUser);
  }

  static async deleteUser(userId) {
    const deletedUser = await UserDao.deleteUser(userId);
    return new UserDto(deletedUser);
  }
}

module.exports = UserService;
