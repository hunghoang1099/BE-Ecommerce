'use strict'
const { Schema, mongoose } = require('mongoose')


const COLLECTION_NAME = 'Keys'
const DOCUMENT_NAME = 'Key'

const keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Shop'
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  refreshTokensUsed: {
    type: Array,
    default: []
  },
  refreshToken: {
    type: String,
    required: true 
  },

}, {
  collection: COLLECTION_NAME,
  timeseries: true
})

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema)