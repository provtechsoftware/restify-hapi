"use strict";

const Joi = require("joi");

const generateDefaultValue = (schema) => {
  let defaultValue = 0;

  if (schema.options.min) {
    defaultValue = schema.options.min;
  }

  if (schema.options.max) {
    defaultValue = schema.options.max;
  }

  if (schema.options.default !== undefined) {
    defaultValue = schema.defaultValue;
  }

  return defaultValue;
};

const toJoi = (schema, options) => {
  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.number();

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  if (schema.options.min) {
    result = result.min(schema.options.min);
  }

  if (schema.options.max) {
    result = result.max(schema.options.max);
  }

  result = result.description(`this resources ${schema.path} field`).default(generateDefaultValue(schema));
  return result;
};

module.exports = {
  toJoi,
  generateDefaultValue
};
