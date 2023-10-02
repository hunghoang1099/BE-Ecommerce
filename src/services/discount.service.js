'use strict';
const {
  BadRequestRequestErrorResponse,
  InternalServerErrorRequestResponse,
  NotFoundRequestErrorResponse,
} = require('../core/error.response');
const { discount } = require('../models/discount.model');
const {
  findDiscountById,
  findDiscountByIdAndUpdate,
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
  findAllDiscountCodesSelect,
} = require('../models/repositories/discount.repo');
const {
  convertToObjectId,
  updateNestedObjectParser,
  removeUndefinedObject,
} = require('../utils');
const { findAllProducts } = require('./product.service.v2');

class DisccountService {
  static async createDiscountCode(payload) {
    const {
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_is_active,
      discount_shopId,
      discount_min_order_value,
      discount_product_ids,
      discount_applies_to,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_max_value,
      discount_max_uses,
      discount_used_count,
      discount_max_uses_per_user,
      discount_users_used,
    } = payload;

    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestRequestErrorResponse(
        'Start date must be before end date'
      );
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestRequestErrorResponse('Discount code has expired!');
    }

    // Create index for discount code
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: discount_code,
        discount_shopId: discount_shopId,
      },
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestRequestErrorResponse('Discount already exitsts!');
    }

    const newDiscount = await discount.create({
      discount_name: discount_name,
      discount_description: discount_description,
      discount_type: discount_type,
      discount_value: discount_value,
      discount_code: discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses: discount_max_uses,
      discount_max_value: discount_max_value,
      discount_used_count: discount_used_count,
      discount_users_used: discount_users_used,
      discount_max_users_per_use: discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shopId: discount_shopId,
      discount_is_active: discount_is_active,
      discount_applies_to: discount_applies_to,
      discount_product_ids:
        discount_applies_to === 'all' ? [] : discount_product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode({ discount_id, payload }) {
    const { discount_start_date, discount_end_date } = payload;
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestRequestErrorResponse(
        'Start date must be before end date'
      );
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_start_date)
    ) {
      throw new BadRequestRequestErrorResponse('Discount code has expired!');
    }

    payload = removeUndefinedObject(payload);
    const updateDiscount = await findDiscountByIdAndUpdate({
      discount_id: discount_id,
      payload: updateNestedObjectParser(payload),
      model: discount,
    });

    return updateDiscount;
  }

  /*
    Get all products available with discount code
  */
  static async getAllProductsWithDiscountCodes({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundRequestErrorResponse('Discount is not exists');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      //get all discounts
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: limit,
        page: page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
        },
        limit: limit,
        page: page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  /*
    Get all discount code of Shop
  */

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: limit,
      page: page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      select: ['discount_name', 'discount_code'],
      model: discount,
    });

    return discounts;
  }

  /*
    Get code details
  */
  static async getDiscountCodeDetails({ discount_id }) {
    const foundDiscount = await findDiscountById(discount_id);
    if (!foundDiscount) {
      throw new NotFoundRequestErrorResponse('Discount is not exists');
    }
    return foundDiscount;
  }

  /*
    Apply Discount Code
  */
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount)
      throw new NotFoundRequestErrorResponse('Discount is not exists!');

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_type,
      discount_start_date,
      discount_end_date,
      discount_max_users_per_use,
      discount_users_used,
      discount_value
    } = foundDiscount;

    if (!discount_is_active)
      throw new NotFoundRequestErrorResponse('Discount expreied!');
    if (!discount_max_uses)
      throw new NotFoundRequestErrorResponse('Discount are out!');
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundRequestErrorResponse('Discount code has expreied!');
    }

    //Check minimun price to use
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      //get total
      totalOrder = products.reduce((acc, product) => {
        console.log(1,acc, product)
        return acc + (product.product_quantity * product.product_price);
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestRequestErrorResponse(
          `discount require minimun order value of ${discount_min_order_value}!`
        );
      }

      if (discount_max_users_per_use > 0) {
        const userUseDiscount = discount_users_used.find(
          (user) => user.userId === userId
        );

        if (userUseDiscount) {
          //check if discount applies to one user
        }

        const amount =
          discount_type === 'fixed_amount'
            ? discount_value
            : totalOrder * (discount_value / 100);

        return {
          totalOrder,
          discount: amount,
          totalPrice: totalOrder - amount,
        };
      }
    }
  }

  /*
    Delete discount 
  */
  static async deleteDiscountCode({ shopId, code }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: code,
      discount_shopId: shopId,
    });

    return deleted;
  }

  static async cancelDiscountCode({ shopId, code, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount)
      throw new NotFoundRequestErrorResponse('Discount is not exists!');

    const result = await discount.findOneAndUpdate(
      {
        discount_code: code,
        discount_shopId: shopId,
      },
      {
        $pull: {
          discount_users_used: userId,
        },
        $inc: {
          discount_max_uses: 1,
          discount_used_count: -1,
        },
      }
    );
    return result;
  }
}

module.exports = DisccountService;
