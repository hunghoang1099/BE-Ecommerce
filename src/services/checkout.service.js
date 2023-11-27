'use strict';

const { BadRequestRequestErrorResponse } = require('../core/error.response');
const { order } = require('../models/order.model');
const { findCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');

class CheckoutService {
  //login and witdout login
  /*
    {
      cartId,
      userId,
      shopOrderIds: [
        {
          shopId,
          shop_discounts: [],
          item_products: [
            "price",
            "quantity",
            "productId"
          ]
        },
        {
          shopId,
          shop_discounts: [
            {
              "shopId",
              "discountId",
              "codeId"
            }
          ],
          item_products: [
            price,
            quantity,
            productId
          ]
        }
      ],
    }
  */
  static async checkOutReview({ cartId, userId, shopOrderIds }) {
    //check cart exists
    const foundCart = await findCartById(cartId);
    if (!foundCart)
      throw new BadRequestRequestErrorResponse('Cart is not exist!');

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shopOrderIdsNew = [];

    //Count total bill
    for (let i = 0; i < shopOrderIds.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shopOrderIds[i];

      //Check product available
      const checkProductInServer = await checkProductByServer(item_products);

      if (!checkProductInServer || checkProductInServer.length === 0)
        throw new BadRequestRequestErrorResponse('Wrong order!');

      const checkOutPrice = checkProductInServer.reduce((acc, prd) => {
        return acc + prd.product_quantity * prd.product_price;
      }, 0);

      //Total price before checkout
      checkout_order.totalPrice += checkOutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkOutPrice,
        priceApplyDiscount: checkOutPrice,
        item_products: checkProductInServer,
      };

      //If shop_discounts > 0, check data valid
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].code,
          userId,
          shopId,
          products: checkProductInServer,
        });

        //Total discount amount
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkOutPrice - discount;
        }
      }

      //Total to payment
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shopOrderIdsNew.push(itemCheckout);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      checkout_order,
    };
  }

  static async orderByUser({
    shopOrderIds,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shopOrderIdsNew, checkout_order } =
      await CheckoutService.checkOutReview({ cartId, userId, shopOrderIds });

    //Check out of stock
    // get new array prd
    const products = shopOrderIdsNew.flatMap((order) => order.item_products);
    const acquireProducts = [];
    for (let i = 0; i < products.length; i++) {
      const { product_id, quantity } = products[i];
      const keyLock = await acquireLock(product_id, quantity, cartId);
      acquireProducts.push( keyLock ? true : false)
      if(keyLock) await releaseLock(keyLock)
    }

    //Check product expire
    if (acquireProducts.includes(flase)) {
      throw new BadRequestRequestErrorResponse('Some products have been updated, Please try again !')
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shopOrderIdsNew, 
    })

    if(newOrder) {
      
    }

    return newOrder;
  }
}

module.exports = CheckoutService;
