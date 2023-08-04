'use strict';
const shopServices = require('../services/shop.service');
class AccessController {

  constructor() {
  }

  signUp = async (req, res, next) => {
    try {
      return res.status(201).json(await shopServices.signUp(req.body));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccessController();