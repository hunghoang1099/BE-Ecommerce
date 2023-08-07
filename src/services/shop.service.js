'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { generateTokenPair } = require('../auth/authUtils')
const { pickDataField } = require('../utils/index')
const { InternalServerErrorRequestErrorResponse, BadRequestRequestErrorResponse } = require('../core/error.response')

const UserRole = {
  SHOP: 'shop',
  WRITE: 'write',
  READ: 'read',
  EDIT: 'edit',
  ADMIN: 'admin'
}
class AccessService {

  constructor() {
  }

  signUp = async ({ name, email, password }) => {

    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) throw new BadRequestRequestErrorResponse('Shop aready registered')

    const hashPassword = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name: name,
      password: hashPassword,
      email: email,
      role: [UserRole.SHOP]
    })

    if (newShop) {
      //create publicKey and privateKey
      const publicKey = await crypto.randomBytes(64).toString('hex')
      const privateKey = await crypto.randomBytes(64).toString('hex')

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey
      })

      if (!keyStore) throw new InternalServerErrorRequestErrorResponse('Genetare Keystore error')
      //create token pair
      const token = await generateTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

      return {
        code: 201,
        metaData: {
          shop: pickDataField({ fields: ['_id', 'name', 'email', 'verify'], object: newShop }),
          token
        }
      }
    }

    return {
      code: 200,
      metaData: null
    }
  }
}

module.exports = new AccessService()