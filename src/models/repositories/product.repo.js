'use strict';

const { Types } = require('mongoose');
const {
  getSelectedField,
  getUnSelectedField,
  convertToObjectId,
} = require('../../utils');
const {
  product,
  clothing,
  electronic,
  furniture,
  cosmetic,
} = require('../product.model');

const findAllProductDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllProductPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      { isPublished: true, $text: { $search: regexSearch } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedField(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(getUnSelectedField(unSelect))
    .lean();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

const findOneAndPublishProduct = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: product_id,
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const findOneAndUnPublishProduct = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: product_id,
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const findProductByIdAndUpdate = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  const result = await model.findByIdAndUpdate(product_id, payload, {
    new: isNew,
  });

  return result;
};

const findProductById = async (productIs) => {
  return await product.findOne({ _id: convertToObjectId(productIs) }).lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById(product.product_id);
      if (foundProduct) {
        return {
          product_price: foundProduct.product_price,
          product_quantity: product.quantity,
          productId: product.product_id,
        };
      }
    })
  );
};

module.exports = {
  findAllProductDraftForShop,
  findOneAndPublishProduct,
  findAllProductPublishForShop,
  findOneAndUnPublishProduct,
  searchProductByUser,
  findAllProducts,
  findProduct,
  findProductByIdAndUpdate,
  findProductById,
  checkProductByServer,
};
