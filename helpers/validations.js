/* eslint-disable camelcase */
'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const comparePassword = (hashedPassword, password) => bcrypt.compareSync(password, hashedPassword);

const isEmpty = input => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  } return true;
};

const empty = input => {
  if (input === undefined || input === '') {
    return true;
  }
};

const isValidEmail = email => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};



const validatePassword = password => {
  if (password.length <= 5 || password === '') {
    return false;
  } return true;
};

const generateUserToken = (email, id, first_name, last_name) => {
  const token = jwt.sign({
    email,
    user_id: id,
    first_name,
    last_name
  },
  process.env.JWT_SECRET, { expiresIn: '3d' });
  return token;
};


module.exports = {
  isValidEmail,
  validatePassword,
  generateUserToken,
  hashPassword,
  comparePassword,
  isEmpty,
  empty
};
