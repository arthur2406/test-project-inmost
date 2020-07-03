'use strict';

const express = require('express');
const routes = require('./routes/index');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

module.exports = app;
