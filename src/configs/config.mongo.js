'use strict'
require('dotenv').config()

const dev = {
  app: {
    port: process.env.DEV_PORT || 3000,
  },
  db: {
    url: process.env.DEV_DB_URL || 'localhost',
    port: process.env.DEV_DB_PORT || '27017',
    name: process.env.DEV_DB_NAME || 'test',
  }

}

const prod = {
  app: {
    port: process.env.PROD_PORT || 3000,
  },
  db: {
    url: process.env.PROD_DB_URL || 'localhost',
    port: process.env.PROD_DB_PORT || '27017',
    name: process.env.PROD_DB_NAME || 'test',
  }
}

const environment = process.env.NODE_ENV || 'dev'
const config = { dev, prod }

module.exports = config[environment]