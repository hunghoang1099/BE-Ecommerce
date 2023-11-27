'use strict';
const { NotFoundRequestErrorResponse } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const { findProductById } = require('../models/repositories/product.repo');

/* 
  Key features: Cart service
  - add product to cart
  - reduce product quantity by one [User]
  - increase quantity by one [User]
  - get cart [User]
  - Delete cart [User]
  - Delete cart item [User]
*/
class CartService {
  /// START REPO CART ///
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active',
    };
    const updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  /// END REPO CART ///

  static async addToCart({ userId, product = {} }) {
    //check cart exists
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      //Create cart
      return await CartService.createUserCart({ userId, product });
    }

    // If has cart but no product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // If cart already exists and has this product
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shopOrderIds }) {
    const { product_id, quantity, old_quantity } =
      shopOrderIds[0]?.item_products[0];

    //Check prd
    const foundProduct = await findProductById(product_id);

    if (!foundProduct)
      throw new NotFoundRequestErrorResponse('Product not exists!');

    //Compare shopId
    if (foundProduct.product_shop.toString() !== shopOrderIds[0]?.shopId) {
      throw new NotFoundRequestErrorResponse(
        'Product do not belong to the shop!'
      );
    }

    if (quantity === 0) {
      await this.deleteUserCart((userId, product_id));
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        product_id,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, product_id }) {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateSet = {
      $pull: {
        cart_products: {
          product_id,
        },
      },
    };

    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: userId,
      })
      .lean();
  }
}

module.exports = CartService;
