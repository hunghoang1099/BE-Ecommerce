'use strict'
const mongoose = require("mongoose")
const { countConnections, checkOverloadingConnections } = require('../helpers/check.connect')
const { db: {host, port, name} } = require('../configs/config.mongo')
require('dotenv').config()


class Database {
  constructor() {
    this.connect()
    countConnections()
    checkOverloadingConnections()
  }
  
  connect(type = 'mongodb') {
    // if (type ==='mongodb') {
    //   mongoose.set('debug', true)
    //   mongoose.set('debug', { color: true })
    // }
    
    let connectString = ''
    if (process.env.MONGODB_CONNECT_TYPE && process.env.MONGODB_CONNECT_TYPE === 'atlas') {
      connectString = process.env.MONGODB_URI
    } else {
      connectString = `mongodb://${host}:${port}/${name}`
    }

    mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Mongo connect error: " + err))

  }

  static getInstance() {
    if(!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb