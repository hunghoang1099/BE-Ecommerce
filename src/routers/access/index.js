'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth');


//Core Error Stautus
//signUp
router.post('/signup', asyncHandler(accessController.signUp))


module.exports = router