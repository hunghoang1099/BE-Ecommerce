'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

//check api key
router.use(apiKey)

//Check permissions
router.use(permission('0000'))

router.use("/api/v1", require('./access/index'))

module.exports = router