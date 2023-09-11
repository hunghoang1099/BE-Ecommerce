'use strict'

const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');


//get list products draft
router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))

// authentication methods
router.use(authentication)

//create product
router.post('/create', asyncHandler(ProductController.createProduct))

//get list products draft
router.get('/draft/all', asyncHandler(ProductController.getListProductDraft))

//get list products published
router.get('/publish/all', asyncHandler(ProductController.getListProductPublished))

//Publish product
router.put('/publish/:id', asyncHandler(ProductController.publishProductByShop))

//UnPublish product
router.put('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
module.exports = router