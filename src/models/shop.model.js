'use strict';
const { model, Schema, Types } = require('mongoose');


const COLLECTION_NAME = 'Shops';
const DOCUMENT_NAME = 'Shop';

// Declare the Schema of the Mongo model
const shopSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 150
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 150
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false,
  },
  role: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);