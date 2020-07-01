'use strict';

const express = require('express');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

module.exports = app;
