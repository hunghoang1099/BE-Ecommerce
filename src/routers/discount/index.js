'use strict'

const express = require('express')
const router = express.Router()
const DiscountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');



//get discount amount
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))

//get all discount with products
router.get('/list_product_code', asyncHandler(DiscountController.getAllProductsWithDiscountCode))

router.use(authentication)

//create discount
router.post('', asyncHandler(DiscountController.createDiscountCode))

//get all discount codes
router.get('', asyncHandler(DiscountController.getAllDiscountCodes))
module.exports = router