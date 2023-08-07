'use strict'
const _ = require('lodash')

const pickDataField = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

module.exports = {
  pickDataField
}