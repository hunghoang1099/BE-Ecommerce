'use strict';

const apiKeyModal = require('../models/apiKey.model');
const crypto = require('crypto');


const findKey = async (key) => {
  // const newKey = await apiKeyModal.create({key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']});
  // console.log(1111, newKey);
  const objKey = await apiKeyModal.findOne({key, status: true}).lean();
  return objKey;
}

module.exports = {
  findKey
}