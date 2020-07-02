'use strict';

const responseMiddleware = (req, res, next) => {
  res.send(res.data);
};

module.exports = responseMiddleware;
