'use strict';

const { Pool } = require('pg');

class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.pool = new Pool();
  }
}

module.exports = BaseRepository;
