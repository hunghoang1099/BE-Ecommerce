'use strict';

const DiscountService = require('../services/discount.service')
const { SuccessResponse } = require('../core/success.response');

class DiscountController {

  createDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Create discount code successfully',
      metaData: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res);
  }

  getAllDiscountCodes = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list discount code successfully',
      metaData: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res);
  }

  getDiscountAmount = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get discount code successfully',
      metaData: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res);
  }


  getAllProductsWithDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get discount code successfully',
      metaData: await DiscountService.getAllProductsWithDiscountCodes({
        ...req.query
      })
    }).send(res);
  }
}

module.exports = new DiscountController();