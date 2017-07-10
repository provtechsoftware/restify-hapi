"use strict";

const mongoose = require("mongoose");
const Joi = require("joi");

const generateDefaultValue = (schema) => {
  let defaultValue = mongoose.Types.ObjectId();

  if (schema.options.default) {
    defaultValue = schema.defaultValue;
  }

  return defaultValue;
};

const toJoi = (schema, options) => {
  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.any();

  if (options.skipRequired !== true) {
    result = result.required();
  }

  result = result.description(`this resources ${schema.path} field`);
  return result;
};

module.exports = {
  toJoi,
  generateDefaultValue
};
