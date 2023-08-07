'use strict'

const { InternalServerErrorRequestResponse, ForbiddenRequestErrorResponse } = require("../core/error.response")
const { findKey } = require("../services/apikey.service")


const HEADER = {
  APIKEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers['x-api-key']?.toString()
    if (!key) throw new ForbiddenRequestErrorResponse('Forbidden')

    //Check key
    const objKey = await findKey(key)
    // console.log(objKey)
    if (!objKey) throw new ForbiddenRequestErrorResponse('Forbidden')

    req.objKey = objKey
    return next()

  } catch (error) {
    console.log(error.message)
    throw new InternalServerErrorRequestResponse('Internal Server Error')
  }
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) throw new ForbiddenRequestErrorResponse('Forbidden')

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) throw new ForbiddenRequestErrorResponse('Forbidden')
    return next()
  }
}


const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  }
}
module.exports = {
  apiKey,
  permission,
  asyncHandler
}