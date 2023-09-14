'use strict';
const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'Inventories';
const DOCUMENT_NAME = 'Inventory';

const InventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, defaultValue: 'unknow' },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_stock: { type: Number, required: true },
    inven_reservations: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: true,
  }
);

module.exports = {
  inventory: model(DOCUMENT_NAME, InventorySchema),
};
