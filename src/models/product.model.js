'use strict'
const { model, Schema } = require('mongoose')


const COLLECTION_NAME = 'Products'
const DOCUMENT_NAME = 'Product'

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true
  },
  product_thumbnail: {
    type: String,
    required: false
  },
  product_description: {
    type: String,
  },
  product_price: {
    type: Number,
  },
  product_quantity: {
    type: Number,
    required: true,
    defaultValue: 0
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronic', 'Clothing', 'Furniture', 'Cosmetic']
  },
  product_shop: {
    type: String,
    ref: 'Shops',
    required: true,
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true,
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
})

const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  material: {
    type: String,
  }
}, {
  collection: 'Clothers',
  timestamps: true
})

const electronicSchema = new Schema({
  manufacture: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  color: {
    type: String,
  },
  product_shop: {
    type: String,
    ref: 'Shops',
    required: true,
  },
}, {
  collection: 'Electronics',
  timestamps: true
})

const cosmeticSchema = new Schema({
  manufacture: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  product_shop: {
    type: String,
    ref: 'Shops',
    required: true,
  },
}, {
  collection: 'Cosmetics',
  timestamps: true
})

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothings', clothingSchema),
  electronic: model('Electronics', electronicSchema),
  cosmetic: model('Cosmetics', cosmeticSchema)
}