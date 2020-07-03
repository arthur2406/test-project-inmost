'use strict';

const { Pool } = require('pg');

class DBConnectionError extends Error {
  constructor(args) {
    super(args);
    this.name = 'DatabaseError';
  }
}

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
      throw new DBConnectionError('Database connection error occured');
    }
  }
}

module.exports = { BaseRepository, DBConnectionError };
