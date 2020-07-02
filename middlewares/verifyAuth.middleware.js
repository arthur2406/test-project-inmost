'use strict';
/* eslint-disable camelcase */

const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');


const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const dbRow = UserService.getOneUser({ email });
    if (!dbRow) {
      res.status(404);
      next(new Error('There is no user with this email'));
    }
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
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
