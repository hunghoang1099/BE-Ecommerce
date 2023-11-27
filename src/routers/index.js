'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

//check api key
router.use(apiKey);

//Check permissions
router.use(permission('0000'));

router.use("/api/v1/checkout", require('./checkout/index'))
router.use('/api/v1/cart', require('./cart/index'));
router.use('/api/v1/discount', require('./discount/index'));
router.use('/api/v1/product', require('./product/index'));
router.use('/api/v1', require('./access/index'));

module.exports = router;
