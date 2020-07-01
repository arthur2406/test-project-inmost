'use strict';

const { TaskRepository } = require('../repositories/taskRepository');

class TaskService {

  handleRepositoryError(e) {
    console.error(e);
    throw e;
  }

  async create(data) {
    try {
      const task = await TaskRepository.create(data);
      return task;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }

  async update(id, data) {
    try {
      const task = await TaskRepository.update(id, data);
      return task;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }



}

module.exports = new TaskService();
