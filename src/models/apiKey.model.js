'use strict';
const { Schema, mongoose } = require('mongoose')


const COLLECTION_NAME = 'apiKeys';
const DOCUMENT_NAME = 'apiKey';

const apiKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  },
  permissions: {
    type: [String],
    require: true,
    enum: ['0000', '1111', '2222']
  }
}, {
  collection: COLLECTION_NAME,
  timeseries: true
});

module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);