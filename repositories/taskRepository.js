/* eslint-disable camelcase */
'use strict';

const { BaseRepository, DBConnectionError } = require('./baseRepository');



class TaskRepository extends BaseRepository {
  constructor() {
    super('tasks');
  }


  async create(data) {
    try {
      const text = `INSERT INTO ${this.collectionName} (user_id, title, description, status) ` +
        'VALUES($1, $2, $3, $4) RETURNING *';
      const values = [data.user_id, data.title, data.description, data.status];
      const client = await this.getClient();
      const { rows } = await client.query(text, values);
      client.release();
      return rows[0];
    } catch (err) {
      if (err instanceof DBConnectionError) {
        throw err;
      }
      throw new Error('Incorrect data passed to create task');
    }
  }

  async update(taskId, data) {
    const { user_id, ...updates } = data;
    try {
      const rowData = [];
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'id') return;
        rowData.push(`${key} = '${value}'`);
      });
      const setClause = rowData.join(', ');
      const query = `UPDATE ${this.collectionName} ` +
        `SET ${setClause} ` +
        `WHERE id = ${taskId} AND user_id = ${user_id} ` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Incorrect data passed to update task');
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
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Unable to update task owner');
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
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Unable to delete task');
    }
  }
}

module.exports = new TaskRepository();
