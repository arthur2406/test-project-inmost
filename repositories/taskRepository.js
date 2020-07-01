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
      const text = 'INSERT INTO TASKS(user_id, title, description, status) ' +
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

  async update(id, data) {
    try {
      const rowData = [];
      Object.entries(data).forEach(arr => {
        rowData.push(`${arr[0]} = '${arr[1]}'`);
      });
      const setClause = rowData.join(', ');
      const query = `UPDATE ${this.collectionName} ` +
        `SET ${setClause} ` +
        `WHERE id = ${id} ` +
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
