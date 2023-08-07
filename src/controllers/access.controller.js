'use strict'
const shopServices = require('../services/shop.service')
class AccessController {

  constructor() {
  }

  signUp = async (req, res, next) => {
      return res.status(201).json(await shopServices.signUp(req.body))
  }
}

module.exports = new AccessController()