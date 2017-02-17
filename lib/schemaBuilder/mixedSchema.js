"use strict";

const Joi = require("joi");

const generateDefaultValue = (schema) => {
  let defaultValue = "mixed";

  if (schema.options.default !== undefined) {
    defaultValue = schema.defaultValue;
  }

  return defaultValue;
};

const toJoi = (schema, options) => {
  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.any();

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  result = result.description(`this resources ${schema.path} field`).default(generateDefaultValue(schema));
  return result;
};

module.exports = {
  toJoi,
  generateDefaultValue
};
