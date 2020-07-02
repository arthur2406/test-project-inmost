'use strict';

const BaseRepository = require('./baseRepository');

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
    } catch (err) {
      throw new Error('Database error occured while trying to create taskr');
    }
  }

  async getUserByEmail(email) {
    try {
      const text = 'SELECT * FROM users WHERE email = $1';
      const client = await this.getClient();
      const { rows } = await client.query(text, [email]);
      client.release();
      return rows[0];
    } catch (err) {
      throw new Error('Database error occured while trying to create taskr');
    }
  }


}

module.exports = new UserRepository();
