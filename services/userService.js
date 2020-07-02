'use strict';

const UserRepository = require('../repositories/userRepository');

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

  async getOneUser(search) {
    try {
      const user = await UserRepository.getOneUser(search);
      return user;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }



  async update(userId, data) {
    try {
      const user = await UserRepository.update(userId, data);
      return user;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }

  async delete(userId) {
    try {
      const user = await UserRepository.delete(userId);
      return user;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }
}

module.exports = new UserService();
