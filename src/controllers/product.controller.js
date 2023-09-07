'use strict'
const { SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {

  createProduct = async(req, res, next) => {
    return new SuccessResponse({
      message: 'Create product success.',
      metaData: await ProductService.createProduct(req.body.product_type, req.body)
    }).send(res)
  }
}

module.exports = new ProductController()