'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { generateTokenPair } = require('../auth/authUtils');
const { pickDataField } = require('../utils/index');

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

    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: '409',
          message: "Email already registered",
          metaData: ''
        }
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name: name,
        password: hashPassword,
        email: email,
        role: [UserRole.SHOP]
      });

      if (newShop) {
        //create publicKey and privateKey
        const publicKey = await crypto.randomBytes(64).toString('hex');
        const privateKey = await crypto.randomBytes(64).toString('hex');

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        });

        if (!keyStore) {
          return {
            code: '500',
            message: "Genetare Keystore error",
            metaData: null
          }
        }

        //create token pair
        const token = await generateTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

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

    } catch (error) {
      return {
        code: 500,
        message: error.message,
        metaData: null
      }
    }
  }
}

module.exports = new AccessService();