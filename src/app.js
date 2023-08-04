const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

//init middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

//init databases
require('./dbs/init.mongodb');

//init routes

module.exports = app;