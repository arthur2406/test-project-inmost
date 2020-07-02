'use strict';
/* eslint-disable camelcase */

const jwt = require('jsonwebtoken');
//const UserService = require('../services/userService');


const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    res.status(400);
    next(new Error('Token not provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
      first_name: decoded.first_name,
      last_name: decoded.last_name
    };
    next();
  } catch (e) {
    res.status(401);
    next(new Error('Authentication failed'));
  }
};

module.exports = verifyToken;
