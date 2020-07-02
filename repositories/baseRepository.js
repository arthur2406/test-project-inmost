'use strict';

const { Pool } = require('pg');

class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.pool = new Pool();
  }


  async getClient() {
    try {
      const client = await this.pool.connect();
      return client;
    } catch  (err) {
      console.error(err);
      throw new Error('Database error');
    }
  }

}

module.exports = BaseRepository;
