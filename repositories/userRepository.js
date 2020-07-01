'use strict';

const { BaseRepository } = require('./baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }
}

module.exports = new UserRepository();
