'use strict'

const apiKeyModal = require('../models/apiKey.model')


const findKey = async (key) => {
  const objKey = await apiKeyModal.findOne({key, status: true}).lean()
  return objKey
}

module.exports = {
  findKey
}