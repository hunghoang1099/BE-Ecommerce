'use strict'

const { Types } = require("mongoose")
const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {

    try {
      // const token = await keyTokenModel.create({
      //   user: userId,
      //   publicKey
      // })
      // return token ? token.publicKey : null

      const filter = { user: userId }
      const update = {
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      }
      const options = { new: true, upsert: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id })
  }

  static findRefreshTokenUsedByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findRefreshTokenByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokens: refreshToken }).lean()
  }

  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId })
  }
}

module.exports = KeyTokenService