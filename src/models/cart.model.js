'use strict';
const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const COLLECTION_NAME = 'Carts';
const DOCUMENT_NAME = 'Cart';

const productSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active',
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      required: true,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn',
    },
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, productSchema),
};
