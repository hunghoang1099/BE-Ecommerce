'use strict'
const { SuccessResponse } = require('../core/success.response')
const ProductServiceV2 = require('../services/product.service.v2')
// const ProductService = require('../services/product.service')

class ProductController {

  createProduct = async(req, res, next) => {
    return new SuccessResponse({
      message: 'Create product success.',
      metaData: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new ProductController()