'use strict';

const { BaseRepository } = require('./baseRepository');

class TaskRepository extends BaseRepository {
  constructor() {
    super('tasks');
  }
}

module.exports = new TaskRepository();
