'use strict';
/* eslint-disable camelcase */

const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');


const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const dbRow = await UserService.getOneUser({ email });
    if (!dbRow) {
      throw new Error();
    }
    req.user = {
      user_id: decoded.user_id,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      creating_date: dbRow.creating_date
    };
  } catch (e) {
    res.status(401);
    return next(new Error('Authentication failed'));
  }

  return next();
};

module.exports = verifyToken;
