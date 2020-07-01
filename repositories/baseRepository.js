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
      this.handleError(new Error('Unable to connect to the database'));
    }
  }

}

module.exports = BaseRepository;
