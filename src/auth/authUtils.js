'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { UnauthorizedRequestErrorResponse, NotFoundRequestErrorResponse } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')


const HEADER = {
  APIKEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
}


const generateTokenPair = async (payload, publicKey, privateKey) => {

  try {
    //Generate access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    //Generate refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    //Verify token
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) console.log('Verify token failed:: ' + error)
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check user missing
    2 - get access token
    3 - verify token
    4 - check keyStore with userID
    5 - If OK, return next
  */


  //1
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new UnauthorizedRequestErrorResponse('Invalid request')


  //2
  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NotFoundRequestErrorResponse('Not found keyStore')

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new UnauthorizedRequestErrorResponse('Invalid request')

  try {
    const decodeUser = JWT.decode(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new UnauthorizedRequestErrorResponse('Invalid user')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

const decodeTokeWithJWT = (token, keySecret) => {
  return JWT.decode(token, keySecret)
}

module.exports = {
  generateTokenPair,
  authentication,
  decodeTokeWithJWT
}