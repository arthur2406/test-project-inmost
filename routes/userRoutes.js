/* eslint-disable camelcase */
'use strict';

const UserService = require('../services/userService');
const responseMiddleware = require('../middlewares/response.middleware');
const { Router } = require('express');
const {
  hashPassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken
} = require('../helpers/validations');

const router = Router();

//Add pagination
// router.get('/', async (req, res, next) => {
//   try {
//     const users = await UserService.searchAll();
//     res.data = users;
//     res.status(200);
//   } catch (err) {
//     next(err);
//   }
//   next();
// }, responseMiddleware);

router.get('/:id', async (req, res, next) => {
  try {
    const user = await UserService.searchById(req.params.id);
    if (user) {
      res.data = user;
      res.status(200);
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (err) {
    next(err);
  }
  next();
}, responseMiddleware);

router.post('/', async (req, res, next) => {
  const {
    email, first_name, last_name, password,
  } = req.body;

  if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
    res.status(400);
    next(new Error('Email, password, first name and last name field cannot be empty'));
  }

  if (!isValidEmail(email)) {
    res.status(400);
    next(new Error('Please enter correct email'));
  }

  if (!validatePassword(password)) {
    res.status(400);
    next(new Error('Password must be more than five(5) characters'));
  }

  const hashedPassword = hashPassword(password);
  const body = {
    email,
    first_name,
    last_name,
    password: hashedPassword,
  };

  try {
    const user = await UserService.create(body);
    delete user.password;
    const token = generateUserToken(user.email, user.id, user.first_name, user.last_name);
    res.data = user;
    res.data.token = token;
    res.status(200);
  } catch (e) {
    next(e);
  }

});

module.exports = router;
