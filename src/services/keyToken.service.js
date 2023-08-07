'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey }) => {
    const token = await keyTokenModel.create({
      user: userId,
      publicKey
    })
    return token ? token.publicKey : null
  }
}

module.exports = KeyTokenService