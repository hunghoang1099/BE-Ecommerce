'use strict'
const _ = require('lodash')

const pickDataField = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectedField = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

module.exports = {
  pickDataField,
  getSelectedField
}