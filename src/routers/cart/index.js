'use strict';

const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

//get discount amount
router.post('', asyncHandler(CartController.addToCart));
router.delete('', asyncHandler(CartController.delete));
router.post('/update', asyncHandler(CartController.update));
router.get('', asyncHandler(CartController.listToCart));

module.exports = router;
