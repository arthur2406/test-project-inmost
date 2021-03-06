/* eslint-disable camelcase */
'use strict';

const { Router } = require('express');
const UserService = require('../services/userService');
const responseMiddleware = require('../middlewares/response.middleware');
const errorHandlingMiddleware = require('../middlewares/error.handling.middleware');
const verifyAuth = require('../middlewares/verifyAuth.middleware');
const {
  hashPassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
  comparePassword
} = require('../helpers/validations');

const router = Router();

// GET api/users/?page=3?items=10

router.get('/me', verifyAuth, async (req, res, next) => {
  res.data = req.user;
  res.status(200);
  return next();
}, responseMiddleware);


router.get('/', async (req, res, next) => {
  try {
    if (req.query.page && req.query.page < 1) {
      res.status(400);
      return next(new Error('Page should be >= 1 '));
    }
    const users = await UserService.getUsers(req.query.page || 1, req.query.items || 10);

    res.data = users.map(u => {
      delete u.password;
      return u;
    });
    res.status(200);
  } catch (err) {
    return next(err);
  }
  return next();
}, responseMiddleware);


router.post('/', async (req, res, next) => {
  const {
    email, first_name, last_name, password,
  } = req.body;

  if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
    res.status(400);
    return next(new Error('Email, password, first name and last name field cannot be empty'));
  }

  if (!isValidEmail(email)) {
    res.status(400);
    return next(new Error('Please enter correct email'));
  }

  if (!validatePassword(password)) {
    res.status(400);
    return next(new Error('Password must be more than five(5) characters'));
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
    const token = generateUserToken(user.email, user.user_id, user.first_name, user.last_name);
    res.data = user;
    res.data.token = token;
    res.status(200);
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    res.status(400);
    return next(new Error('Email or Password detail is missing'));
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    res.status(400);
    return next(new Error('Please enter a valid Email and Password'));
  }
  try {
    const user = await UserService.getOneUser({ email });
    if (!user) {
      res.status(404);
      return next(new Error('User with this email does not exist!'));
    }

    if (!comparePassword(user.password, password)) {
      res.status(400);
      return next(new Error('Provided password is incorrect'));
    }

    const token = generateUserToken(user.email, user.user_id, user.first_name, user.last_name);
    delete user.password;
    res.data = user;
    res.data.token = token;
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();

}, responseMiddleware);

router.put('/me', verifyAuth, async (req, res, next) => {
  const updates = req.body;
  const allowedUpdates = ['first_name', 'last_name', 'email', 'password'];
  const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    res.status('400');
    return next(new Error('Invalid updates'));
  }

  for (const val of Object.values(updates)) {
    if (isEmpty(val)) {
      res.status(400);
      return next(new Error('Any field cannot be empty'));
    }
  }

  if (updates.email && !isValidEmail(updates.email)) {
    res.status(400);
    return next(new Error('Please enter correct email'));
  }

  if (updates.password) {
    if (!validatePassword(updates.password)) {
      res.status(400);
      return next(new Error('Password must be more than five(5) characters'));
    }
    req.body.password = hashPassword(req.body.password);
  }

  try {
    const user = await UserService.update(req.user.user_id, req.body);
    if (user) {
      delete user.password;
      res.data = user;
      res.status(200);
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);

router.delete('/me', verifyAuth, async (req, res, next) => {
  try {
    const user = await UserService.delete(req.user.user_id);
    delete user.password;
    res.data = user;
    res.status(200);
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);

router.use(errorHandlingMiddleware);

module.exports = router;
