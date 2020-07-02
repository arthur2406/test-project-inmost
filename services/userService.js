'use strict';

const { UserRepository } = require('../repositories/userRepository');

class UserService {

  handleRepositoryError(e) {
    console.error(e);
    throw e;
  }

  async create(data) {
    try {
      const user = await UserRepository.create(data);
      return user;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await UserRepository.getUserByEmail(email);
      return user;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }
}

module.exports = new UserService();
