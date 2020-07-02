'use strict';
/* eslint-disable camelcase */

const { BaseRepository, DBConnectionError } = require('./baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }


  async create(data) {
    try {
      const text = `INSERT INTO ${this.collectionName} (first_name, last_name, password, email) ` +
        'VALUES($1, $2, $3, $4) RETURNING *';
      const values = [
        data.first_name,
        data.last_name,
        data.password,
        data.email
      ];
      const client = await this.getClient();
      const { rows } = await client.query(text, values);
      client.release();
      return rows[0];
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Incorrect data passed to create user');
    }
  }

  async getOneUser(search) {
    try {
      const column = search.email ? 'email' : 'user_id';
      const text = `SELECT * FROM users WHERE ${column} = $1`;
      const values = [search.email || search.user_id];
      const client = await this.getClient();
      const { rows } = await client.query(text, values);
      client.release();
      return rows[0];
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Unable to get user');
    }
  }



  async update(userId, data) {
    const updates = data;
    try {
      const rowData = [];
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'id') return;
        rowData.push(`${key} = '${value}'`);
      });
      const setClause = rowData.join(', ');
      const query = `UPDATE ${this.collectionName} ` +
        `SET ${setClause} ` +
        `WHERE id = ${userId} ` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Incorrect data passed to update user');
    }
  }

  //will not delete

  async delete(userId) {
    try {
      const query = `DELETE FROM ${this.collectionName} ` +
        `WHERE user_id = ${userId}` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Unable to delete user');
    }
  }
}

module.exports = new UserRepository();
