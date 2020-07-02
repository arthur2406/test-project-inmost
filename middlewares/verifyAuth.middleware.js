'use strict';
/* eslint-disable camelcase */

const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');


const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const dbRow = UserService.getUserByEmail(decoded.email);
    if (!dbRow) {
      res.status(401);
      next(new Error('There is no user with this email'));
    }
    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
      first_name: decoded.first_name,
      last_name: decoded.last_name
    };
  } catch (e) {
    res.status(401);
    next(new Error('Authentication failed'));
  }

  next();
};

module.exports = verifyToken;
