'use strict';

const CartService = require('../services/cart.service');
const { SuccessResponse } = require('../core/success.response');

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new cart successfully',
      metaData: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update cart successfully',
      metaData: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete cart successfully',
      metaData: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List cart successfully',
      metaData: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
