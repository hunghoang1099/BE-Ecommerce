'use strict';

const {
  BadRequestRequestErrorResponse,
  InternalServerErrorRequestResponse,
} = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  cosmetic,
  furniture,
} = require('../models/product.model');
const { insertInventory } = require('../models/repositories/inventory.repo');
const {
  findAllProductDraftForShop,
  findOneAndPublishProduct,
  findAllProductPublishForShop,
  findOneAndUnPublishProduct,
  searchProductByUser,
  findAllProduct,
  findProduct,
  findProductByIdAndUpdate,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

class ProductFactory {
  /*
      type: 'String',
      payload
    */
  static productRegistry = {}; //key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestRequestErrorResponse(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  static async findProductAndUpdate(type, id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestRequestErrorResponse(`Invalid product type: ${type}`);

    return new productClass(payload).updateProduct(id);
  }

  static async findAllProductDraftForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isDraft: true };
    return await findAllProductDraftForShop({ query, limit, skip });
  }

  static async findAllProductPublishForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isPublished: true };
    return await findAllProductPublishForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await findOneAndPublishProduct({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await findOneAndUnPublishProduct({ product_shop, product_id });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    const select = [
      'product_name',
      'product_price',
      'product_quantity',
      'product_description',
    ];
    return await findAllProduct({ limit, sort, page, filter, select });
  }

  static async findProduct({ product_id }) {
    const unSelect = ['__v', 'product_slug'];
    return await findProduct({ product_id, unSelect });
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
    product_price,
  }) {
    this.product_name = product_name;
    this.product_thumbnail = product_thumbnail;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_price = product_price;
  }

  //create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if(newProduct) {
      //add product_stock to inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }
    return newProduct;
  }

  //update product
  async updateProduct(productId, payload, model = product) {
    return await findProductByIdAndUpdate({
      product_id: productId,
      payload,
      model,
    });
  }
}

//define sub-class for product clothing field
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await findProductByIdAndUpdate({
        product_id,
        payload: updateNestedObjectParser(payload.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(payload));
    return updateProduct;
  }
}

//define sub-class for product electronic field
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await findProductByIdAndUpdate({
        product_id,
        payload: updateNestedObjectParser(payload.product_attributes),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(payload));
    return updateProduct;
  }
}

//define sub-class for product cosmetic field
class Cosmetic extends Product {
  async createProduct() {
    const newCosmetic = await cosmetic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newCosmetic)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    const newProduct = await super.createProduct(newCosmetic._id);
    if (!newProduct)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await findProductByIdAndUpdate({
        product_id,
        payload: updateNestedObjectParser(payload.product_attributes),
        model: cosmetic,
      });
    }

    const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(payload));
    return updateProduct;
  }
}

//define sub-class for product funiture field
class Furniture extends Product {
  async createProduct() {
    const newFuniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFuniture)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct)
      throw new InternalServerErrorRequestResponse(
        'Something went wrong ! Please try again.'
      );

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await findProductByIdAndUpdate({
        product_id,
        payload: updateNestedObjectParser(payload.product_attributes),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(payload));
    return updateProduct;
  }
}

//Register product type
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Cosmetic', Cosmetic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
