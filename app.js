'use strict';

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const routes = require('./routes/index');
//routes(app);

module.exports = app;
