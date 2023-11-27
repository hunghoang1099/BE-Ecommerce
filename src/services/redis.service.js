'use strict';

const redis = require('redis');
const { promisify } = require('util');
const {
  reservationInventory,
} = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (product_id, quantity, cartId) => {
  const key = `lock_v2023_${product_id}`;
  const retryTime = 10;
  const expireTime = 3000;

  for (let i = 0; i < array.length; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(result);

    if (result === 1) {
      //Continue handle iventory
      const isReversation = await reservationInventory({
        productId: product_id,
        quantity,
        cartId,
      });

      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 50);
      });
    }
  }
};

const releaseLock = async (keyLock) => {
  const deAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await deAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
