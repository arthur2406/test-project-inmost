/* eslint-disable camelcase */
'use strict';

const { Router } = require('express');
const TaskService = require('../services/taskService');
const responseMiddleware = require('../middlewares/response.middleware');
const errorHandlingMiddleware = require('../middlewares/error.handling.middleware');
const verifyAuth = require('../middlewares/verifyAuth.middleware');
const { isEmpty } = require('../helpers/validations');

const router = Router();

// GET /api/tasks/?status={status}&sortByUsers={new/old}

const statuses = ['View', 'In Progress', 'Done'];

router.get('/', verifyAuth, async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-const
    let { sortByUsers: sort, status } = req.query;
    if (status && !statuses.includes(status)) {
      res.status(400);
      return next(new Error('Status should be "View", "In progress" or "Done"'));
    }

    if (sort) {
      if (!['new', 'old'].includes(sort)) {
        res.status(400);
        return next(new Error('sortByUsers values should be "new" or "old"'));
      }
      sort = sort === 'new' ? 'DESC' : 'ASC';
    }

    const tasks = await TaskService.getTasks(status, sort);
    res.data = tasks;
    res.status(200);
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);



router.post('/', verifyAuth, async (req, res, next) => {
  const {
    title, description, status
  } = req.body;

  if (isEmpty(title) || isEmpty(description) || isEmpty(status)) {
    res.status(400);
    return next(new Error('Title, description and status cannot be empty'));
  }

  if (!statuses.includes(status)) {
    res.status(400);
    return next(new Error('Status should be "View", "In progress" or "Done"'));
  }

  try {
    const body = {
      title,
      description,
      status,
      user_id: req.user.user_id
    };
    const task = await TaskService.create(body);
    res.data = task;
    res.status(201);
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);

// PUT /api/tasks/{id}?status={status}

router.put('/:id', verifyAuth, async (req, res, next) => {
  const updates = req.body;
  const allowedUpdates = ['title', 'description', 'status'];
  const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    res.status(400);
    return next(new Error('Invalid updates'));
  }

  for (const val of Object.values(updates)) {
    if (isEmpty(val)) {
      res.status(400);
      return next(new Error('Any field cannot be empty'));
    }
  }

  if (req.query.status && !statuses.includes(req.query.status)) {
    res.status(400);
    return next(new Error('Status should be "View", "In progress" or "Done"'));
  }

  try {
    if (req.query.status) {
      req.body.status = req.query.status;
    }
    req.body.user_id = req.user.user_id;
    const task = await TaskService.update(req.params.id, req.body);
    if (task) {
      res.data = task;
      res.status(200);
    } else {
      res.status(404);
      return next(new Error('Task not found'));
    }
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);

router.put('/:task_id/:user_id', verifyAuth, async (req, res, next) => {
  try {
    const task = await TaskService.updateUser(req.params.task_id, req.user.user_id, req.params.user_id);
    if (task) {
      res.data = task;
      res.status(200);
    } else {
      res.status(400);
      return next(new Error('Unable to update task owner'));
    }
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);


router.delete('/:id', verifyAuth, async (req, res, next) => {
  try {
    const task = await TaskService.delete(req.params.id, req.user.user_id);
    if (task) {
      res.data = task;
      res.status(200);
    } else {
      res.status(404);
      return next(new Error('Task not found'));
    }
  } catch (e) {
    res.status(400);
    return next(e);
  }

  return next();
}, responseMiddleware);

router.use(errorHandlingMiddleware);


module.exports = router;
