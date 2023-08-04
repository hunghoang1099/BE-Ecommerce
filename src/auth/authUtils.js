'use strict';
const JWT = require('jsonwebtoken');

const generateTokenPair = async (payload, publicKey, privateKey) => {
  
  try {
    //Generate access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    });

    //Generate refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days'
    });

    //Verify token
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) console.log('Verify token failed:: ' + error);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  generateTokenPair
}