"use strict";

const Joi = require("joi");

const Validator = require("../tools/validator");

const generateDefaultValue = (schema) => {
  let defaultValue = "string";

  if (schema.path.toLowerCase().indexOf("password") > -1) {
    defaultValue = Validator.generateRandomPassword();
  }

  if (schema.options.default) {
    defaultValue = schema.defaultValue;
  }

  return defaultValue;
};

const toJoi = (schema, options) => {
  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.string();
  let lowPath = schema.path.toLowerCase();

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  if (schema.options.minlength) {
    result = result.min(schema.options.minlength);
  }

  if (schema.options.maxlength) {
    result = result.max(schema.options.maxlength);
  }

  if (schema.options.match) {
    result = result.regex(schema.options.match);
  }

  if (schema.enumValues.length > 0) {
    result = result.valid(schema.enumValues);
  }

  if (lowPath.indexOf("token") > -1) {
    result = result.token();
  } else if (lowPath.indexOf("base64") > -1) {
    result = result.base64();
  } else if (lowPath.indexOf("email") > -1) {
    result = result.email();
  }

  result = result.description(`this resources ${schema.path} field`).default(generateDefaultValue(schema));
  return result;
};

module.exports = {
  toJoi,
  generateDefaultValue
};
