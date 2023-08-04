'use strict';

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const token = await keyTokenModel.create({
        user: userId,
        publicKey
      })
      return token ? token.publicKey : null;
    } catch (error) {
      console.log("Create new token document error::" + error.message);
      return error;
    }
  }
}

module.exports = KeyTokenService;