"use strict";

const Joi = require("joi");

const dispatchDate = (value) => {
  let date;

  // this is the case for default: Date.now
  if (typeof value === "function") {
    date = value();
  } else {
    date = new Date(value);
  }

  return date;
};

const generateDefaultValue = (schema) => {
  let defaultValue = new Date();

  if (schema.options.min) {
    defaultValue = dispatchDate(schema.options.min);
  }

  if (schema.options.max) {
    defaultValue = dispatchDate(schema.options.max);
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

  let result = Joi.date();

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  if (schema.options.min) {
    result = result.min(dispatchDate(schema.options.min));
  }

  if (schema.options.max) {
    result = result.max(dispatchDate(schema.options.max));
  }

  result = result.description(`this resources ${schema.path} field`).default(generateDefaultValue(schema));
  return result;
};

module.exports = {
  toJoi,
  generateDefaultValue
};
