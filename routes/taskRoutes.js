'use strict';

const { Router } = require('express');
const TaskService = require('../services/userService');
const responseMiddleware = require('../middlewares/response.middleware');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const task = await TaskService.create({
      // eslint-disable-next-line camelcase
      user_id: req.user.id,
      ...req.body,
    });
    res.data = task;
    res.status(201);
  } catch (e) {
    next(e);
  }
}, responseMiddleware);

router.put('/:id', auth, async (req, res, next) => {
  try {
    const task = await TaskService.update(req.params.id, req.body);
    if (task) {
      res.data = task;
      res.status(200);
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (e) {
    next(e);
  }
}, responseMiddleware);


// router.get('/:id', auth, async (req, res, next) => {
//   try {
//     const task = await TaskService.searchById(id);
//   }
// });

module.exports = router;
