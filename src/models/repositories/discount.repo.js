'use strict';
const { discount } = require('../../models/discount.model');
const { getSelectedField, getUnSelectedField, convertToObjectId } = require('../../utils');

const findDiscountById = async (id) => {
  return await discount.findById(id);
};

const findDiscountByIdAndUpdate = async ({
  discount_id,
  payload,
  model,
  isNew = true,
}) => {
  const result = await model.findByIdAndUpdate(discount_id, payload, {
    new: isNew,
  });

  return result;
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectedField(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedField(select))
    .lean();

  return documents;
};

const findDiscountByCodeAndShopId = async ({ discount_code, shopId }) => {
  return await discount
    .findOne({
      discount_code: discount_code,
      discount_shopId: convertToObjectId(shopId),
    })
    .lean();
};

const checkDiscountExists = async ({model, filter}) => {
  return model.findOne(filter).lean();
}

module.exports = {
  findDiscountById,
  findDiscountByIdAndUpdate,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  findDiscountByCodeAndShopId,
  checkDiscountExists
};
