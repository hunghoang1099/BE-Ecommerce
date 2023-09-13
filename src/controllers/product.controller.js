"use strict";
const { SuccessResponse } = require("../core/success.response");
const ProductServiceV2 = require("../services/product.service.v2");
// const ProductService = require('../services/product.service')

class ProductController {
  createProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create product success.",
      metaData: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListProductDraft = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list product draft success.",
      metaData: await ProductServiceV2.findAllProductDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListProductPublished = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list product publish success.",
      metaData: await ProductServiceV2.findAllProductPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list product success.",
      metaData: await ProductServiceV2.searchProduct(req.params),
    }).send(res);
  };

  getAllProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list product success.",
      metaData: await ProductServiceV2.findAllProduct(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get product success.",
      metaData: await ProductServiceV2.findProduct({
        product_id: req.params.id
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Publish product draft success.",
      metaData: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Publish product draft success.",
      metaData: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
