const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const router = require('./routers/index');
const app = express();

//init databases
// require('./dbs/init.mongodb');
// const { connectRedis } = require('./dbs/init.redis');
// connectRedis();

//init middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

//init routes
app.use('/', router);

//handle erorr routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
