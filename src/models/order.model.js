'use strict';
const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Order';

const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_tracking_number: {
      type: String,
      default: '#000026112023',
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled'],
      default: 'pending',
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
  order: model(DOCUMENT_NAME, orderSchema),
};
