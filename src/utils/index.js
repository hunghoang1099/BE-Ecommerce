'use strict';
const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectId = (id) => {
  return new Types.ObjectId(id);
};

const pickDataField = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectedField = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectedField = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (!object[key]) {
      delete object[key];
    }
  });

  return object;
};

const updateNestedObjectParser = (object) => {
  const final = {};

  Object.keys(object || {}).forEach((key) => {
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key]);
      Object.keys(response || {}).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = object[key];
    }
  });

  return final;
};

module.exports = {
  pickDataField,
  getSelectedField,
  getUnSelectedField,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectId
};
