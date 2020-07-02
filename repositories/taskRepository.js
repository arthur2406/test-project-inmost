'use strict';

const BaseRepository = require('./baseRepository');

const statuses = ['View', 'In Progress', 'Done'];

class TaskRepository extends BaseRepository {
  constructor() {
    super('tasks');
  }


  async create(data) {
    if (!statuses.find(s => s ===  data.status)) {
      throw new Error('Incorrect status');
    }
    try {
      const text = `INSERT INTO ${this.collectionName} (user_id, title, description, status) ` +
        'VALUES($1, $2, $3, $4) RETURNING *';
      const values = [data.user_id, data.title, data.description, data.status];
      const client = await this.getClient();
      const { rows } = await client.query(text, values);
      client.release();
      return rows[0];
    } catch (err) {
      throw new Error('Incorrect data to create task');
    }
  }

  async update(taskId, data) {
    const { userId, ...updates } = data;
    const allowedUpdates = ['title', 'description', 'status'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      throw new Error('Invalid updates');
    }

    try {
      const rowData = [];
      Object.entries(updates).forEach(arr => {
        if (arr[0] === 'id') return;
        rowData.push(`${arr[0]} = '${arr[1]}'`);
      });
      const setClause = rowData.join(', ');
      const query = `UPDATE ${this.collectionName} ` +
        `SET ${setClause} ` +
        `WHERE id = ${taskId} AND user_id = ${userId} ` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      throw new Error('Incorrect data ta update task');
    }
  }

  async updateUser(taskId, userId) {
    try {
      const query = `UPDATE ${this.collectionName} ` +
        `SET user_id = ${userId} ` +
        `WHERE id = ${taskId} ` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      throw new Error('Incorrect userId');
    }
  }

  async delete(taskId, userId) {
    try {
      const query = `DELETE FROM ${this.collectionName} ` +
        `WHERE id = ${taskId} AND user_id = ${userId}` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      throw new Error('Incorrect data ta update task');
    }
  }
}

module.exports = new TaskRepository();
