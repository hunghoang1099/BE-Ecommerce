'use strict'
const { findKey } = require("../services/apikey.service")


const HEADER = {
  APIKEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    const key = req.headers[HEADER.APIKEY]?.toString()
    if (!key) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Forbidden'
      })
    }

    //Check key
    const objKey = await findKey(key)
    if (!objKey) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Forbidden'
      })
    }

    req.objKey = objKey
    return next()
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Permission denied'
      })
    }

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Permission denied'
      })
    }
    return next()
  }
}

module.exports = {
  apiKey,
  permission,
}