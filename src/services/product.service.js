'use strict';

const { BadRequestRequestErrorResponse, InternalServerErrorRequestResponse } = require('../core/error.response');
const { product, clother, electronic } = require('../models/product.model')

class ProductFactory {

  /*
      type: 'String',
      payload
    */
  static createProduct = async (type, payload) => {
    switch (type) {
      case 'Electronic':
        return new Electronic(payload).createProduct();
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestRequestErrorResponse(`Invalid product type: ${type}`)
    }
  }
}


/*
    product_name,
    product_thumbnail,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_price
*/
// define base product class
class Product {
  constructor({
    product_name,
    product_thumbnail,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_price
  }) {
    this.product_name = product_name
    this.product_thumbnail = product_thumbnail
    this.product_description = product_description
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_price = product_price
  }

  //create new product
  async createProduct() {
    return await product.create(this)
  }
}


//define sub-class for product clothing field
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clother.create(this.product_attributes)
    if (!newClothing) throw new InternalServerErrorRequestResponse('Something went wrong ! Please try again.')

    const newProduct = await super.createProduct()
    if (!newProduct) throw new InternalServerErrorRequestResponse('Something went wrong ! Please try again.')

    return newProduct
  }
}

//define sub-class for product electronic field
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes)
    if (!newElectronic) throw new InternalServerErrorRequestResponse('Something went wrong ! Please try again.')

    const newProduct = await super.createProduct()
    if (!newProduct) throw new InternalServerErrorRequestResponse('Something went wrong ! Please try again.')

    return newProduct
  }
}


module.exports = ProductFactory