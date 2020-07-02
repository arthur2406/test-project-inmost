'use strict';

// eslint-disable-next-line no-unused-vars
const responseMiddleware = (req, res, next) => {
  res.send(res.data);
};

module.exports = responseMiddleware;
