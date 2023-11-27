'use strict';
const { inventory } = require('../../models/inventory.model');
const { Types } = require('mongoose');
const { convertToObjectId } = require('../../utils');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknow',
}) => {
  return await inventory.create({
    inven_product_id: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_product_id: convertToObjectId(productId),
    inven_stock: {
      $gte: quantity,
    },
  };

  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createOn: new Date(),
      },
    },
  };

  const options = {
    upsert: true,
    new: true,
  };

  return await inventory.updateOne(query, updateSet, options);
};
module.exports = {
  insertInventory,
  reservationInventory,
};
