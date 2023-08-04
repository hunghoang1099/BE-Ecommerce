const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const router = require('./routers/index');
const app = express();

//init middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
//init databases
require('./dbs/init.mongodb');

//init routes
app.use('/', router);


module.exports = app;