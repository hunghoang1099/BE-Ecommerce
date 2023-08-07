'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
// check count connections
const countConnections = () => {
  const numberConnections = mongoose.connections.length
  console.log(`Number connections: ${numberConnections}`)
}

//check overloading connections
const checkOverloadingConnections = () => {
  const _SECONDS = 5000

  setInterval(() => {
    const numberConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    const maxConnections = numCores * memoryUsage / 1024 / 1024

    // console.log(`Memories usage: ${memoryUsage / 1024 / 1024}` + 'MB')
    if (numberConnections > maxConnections) {
      console.log(`Overloading connections: ${numberConnections}`)
    }
  }, _SECONDS) //Monitor every 5 second
}

module.exports = {
  countConnections,
  checkOverloadingConnections
}