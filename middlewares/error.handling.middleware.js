'use strict';
/* eslint-disable no-unused-vars */
const { DBConnectionError } = require('../repositories/baseRepository');

const errorHandlingMiddleware = (err, req, res, next) => {
  if (err instanceof DBConnectionError) res.status(500);
  res.send({ error: true, message: err.message });
};

module.exports = errorHandlingMiddleware;
