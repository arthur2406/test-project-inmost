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
      throw new Error('Unable to create user');
    }
  }

  async getUsers(page, itemsPerPage) {
    try {
      const text = `SELECT * FROM ${this.collectionName} ` +
        `LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage}`;
      const client = await this.getClient();
      const { rows } = await client.query(text);
      client.release();
      return rows;
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Unable to get users');
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
        value = value.replace('\'', '\'\'');
        if (key === 'id') return;
        rowData.push(`${key} = '${value}'`);
      });
      const setClause = rowData.join(', ');
      const query = `UPDATE ${this.collectionName} ` +
        `SET ${setClause} ` +
        `WHERE user_id = ${userId} ` +
        'RETURNING * ;';
      const client = await this.getClient();
      const { rows } = await client.query(query);
      client.release();
      return rows[0];
    } catch (e) {
      if (e instanceof DBConnectionError) {
        throw e;
      }
      throw new Error('Unable to update user');
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
