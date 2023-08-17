'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { generateTokenPair, decodeTokeWithJWT } = require('../auth/authUtils')
const { pickDataField } = require('../utils/index')
const { InternalServerErrorRequestResponse, BadRequestRequestErrorResponse, ForbiddenRequestErrorResponse, UnauthorizedRequestErrorResponse } = require('../core/error.response')
const { findShopByEmail } = require('./shop.services')
const keyTokenModel = require('../models/keyToken.model')

const UserRole = {
  SHOP: 'shop',
  WRITE: 'write',
  READ: 'read',
  EDIT: 'edit',
  ADMIN: 'admin'
}
class AccessService {

  handleRefreshToken = async (refreshToken) => {

    //Check token has used
    const foundToken = await KeyTokenService.findRefreshTokenUsedByRefreshToken(refreshToken)
    if (foundToken) {
      //decode to who is what user
      const { userId, email } = await decodeTokeWithJWT(refreshToken, foundToken.privateKey)
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenRequestErrorResponse('Something went wrong ! Please login again.')
    }

    const holderToken = await KeyTokenService.findRefreshTokenByRefreshToken(refreshToken)
    if (!holderToken) throw new UnauthorizedRequestErrorResponse('Shoppp not registered !')

    //verify token
    const { userId, email } = decodeTokeWithJWT(refreshToken, holderToken.privateKey)
    const foundShop = await findShopByEmail({ email })
    if (!foundShop) throw new UnauthorizedRequestErrorResponse('Shop not registered !')

    //Create new access token and refresh token
    const tokens = await generateTokenPair({ userId: userId, email: email }, holderToken.publicKey, holderToken.privateKey)

    //Update token to dbs
    const options = {
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken //has used to get new token
      }
    }

    await keyTokenModel.findOneAndUpdate({
      _id: holderToken._id
    }, options);

    return {
      user: { userId, email },
      tokens
    }
  }

  logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }

  login = async ({ email, password, refreshToken = null }) => {
    //Found Shop
    const foundShop = await findShopByEmail({ email })
    if (!foundShop) throw new BadRequestRequestErrorResponse('Shop not found');

    //Compare Password
    const matchPassword = await bcrypt.compare(password, foundShop.password)
    if (!matchPassword) throw new BadRequestRequestErrorResponse('Wrong password');

    //create publicKey and privateKey
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')

    //Generate token
    const { _id: userId } = foundShop
    const tokens = await generateTokenPair({ userId: userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      userId: userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    });

    return {
      shop: pickDataField({ fields: ['_id', 'name', 'email', 'verify'], object: foundShop }),
      tokens
    }
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
      const publicKey = crypto.randomBytes(64).toString('hex')
      const privateKey = crypto.randomBytes(64).toString('hex')

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey
      })

      if (!keyStore) throw new InternalServerErrorRequestResponse('Genetare Keystore error')
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