'use strict';

const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');


module.exports = app => {
  app.use('/api/users', userRoutes);
  app.use('/api/tasks', taskRoutes);
};
