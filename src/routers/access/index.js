'use strict'

const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');


//Core Error Stautus
//signUp
router.post('/shop/signup', asyncHandler(AccessController.signUp))

//signIn
router.post('/shop/login', asyncHandler(AccessController.login))


//Authentication
router.use(authentication)

//logout
router.post('/shop/logout', asyncHandler(AccessController.logout))

//refresh tokens
router.post('/shop/token/refresh', asyncHandler(AccessController.handleRefreshToken))
module.exports = router