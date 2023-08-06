'use strict';

const { findKey } = require("../services/apikey.service");


const HEADER = {
  APIKEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers['x-api-key']?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    //Check key
    const objKey = await findKey(key);
    console.log(objKey);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objKey = objKey;
    return next();

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Server Error'
    })
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission dinied'
      })
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission dinied'
      })
    }
    return next();
  };
}

module.exports = {
  apiKey,
  permission
}