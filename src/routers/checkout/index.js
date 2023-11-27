'use strict';

const express = require('express');
const router = express.Router();
const CheckoutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

//get discount amount
router.post('/review', asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
