'use strict'
const { model, Schema } = require('mongoose')
const slugify = require('slugify')

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
  product_slug: {
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
  },
  product_ratingsAverage: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    // convert 4,42321 > 4,4
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: {
    type: Array,
    default: []
  },
  isDraff: {
    type: Boolean,
    default: true,
    index: true,
    select: false
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: false
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
})

// Document middleware: run befor document .save(), .create()...
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, {lower: true})
  next()
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

const furnitureSchema = new Schema({
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
  cosmetic: model('Cosmetics', cosmeticSchema),
  funiture: model('Furniture', furnitureSchema)
}