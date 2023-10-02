'use strict';
const { cart } = require('../models/cart.model');

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
    updateOrInsert = {
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
}
