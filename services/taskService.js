'use strict';

const TaskRepository = require('../repositories/taskRepository');

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

  async update(taskId, data) {
    try {
      const task = await TaskRepository.update(taskId, data);
      return task;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }

  async updateUser(taskId, userId) {
    try {
      const task = await TaskRepository.updateUser(taskId, userId);
      return task;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }

  async delete(taskId, userId) {
    try {
      const task = await TaskRepository.delete(taskId, userId);
      return task;
    } catch (e) {
      this.handleRepositoryError(e);
    }
  }
}

module.exports = new TaskService();
