'use strict';

const { Router } = require('express');
const TaskService = require('../services/userService');
const responseMiddleware = require('../middlewares/response.middleware');
const auth = require('../middlewares/auth.middleware');

const router = Router();

// GET /api/tasks/?status={status}&sortByUsers

// router.get('/:id', auth, async (req, res, next) => {
//   try {
//     const task = await TaskService.searchById(id);
//   } catch (e) {

//   }
// });

router.post('/', auth, async (req, res, next) => {
  try {
    const task = await TaskService.create({
      // eslint-disable-next-line camelcase
      user_id: (req.body.userId ? req.body.userId : req.user.id),
      ...req.body,
    });
    res.data = task;
    res.status(201);
  } catch (e) {
    next(e);
  }

  next();
}, responseMiddleware);

// PUT /api/tasks/{id}?status={status}

router.put('/:id', auth, async (req, res, next) => {
  try {
    if (req.query.status) {
      req.body.status = req.query.status;
    }
    req.body.userId = req.user.id;
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

  next();
}, responseMiddleware);

router.put('/:taskId/:userId', auth, async (req, res, next) => {
  try {
    const task = await TaskService.updateUser(req.params.taskId, req.params.userId);
    if (task) {
      res.data = task;
      res.status(200);
    } else {
      res.status(404);
      next(new Error('Incorrect taskId'));
    }
  } catch (e) {
    next(e);
  }
}, responseMiddleware);


router.delete('/:id', auth, async (req, res, next) => {
  try {
    const task = await TaskService.delete(req.params.id, req.user.id);
    if (task) {
      res.data = task;
      res.status(200);
    } else {
      res.status(404);
      next(new Error('Task not found'));
    }
  } catch (e) {
    next(e);
  }
}, responseMiddleware);



module.exports = router;
