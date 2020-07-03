'use strict';

const TaskRepository = require('../repositories/taskRepository');

class TaskService {

  handleRepositoryError(e) {
    console.error(e);
    throw e;
  }

  async getTasks(status, sort) {
    try {
      const tasks = await TaskRepository.getTasks(status, sort);
      return tasks;
    } catch (e) {
      this.handleRepositoryError(e);
    }
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

  async updateUser(taskId, ownerId, newOwnerId) {
    try {
      const task = await TaskRepository.updateUser(taskId, ownerId, newOwnerId);
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
