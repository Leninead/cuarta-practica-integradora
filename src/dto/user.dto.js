class UserDto {
    constructor({ _id, firstName, lastName, email, age, role }) {
      this.id = _id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.age = age;
      this.role = role;
    }
  }
  
  module.exports = UserDto;
  