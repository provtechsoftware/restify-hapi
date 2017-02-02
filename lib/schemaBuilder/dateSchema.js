"use strict";

const Joi = require("joi");

const toJoi = (schema, options) => {
  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.date();

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  if (schema.options.min) {
    // this is the case for default: Date.now
    if (typeof schema.options.min === "function") {
      result = result.min(schema.options.min());
    } else {
      result = result.min(new Date(schema.options.min));
    }
  }

  if (schema.options.max) {
    // this is the case for default: Date.now
    if (typeof schema.options.max === "function") {
      result = result.max(schema.options.max());
    } else {
      result = result.max(new Date(schema.options.max));
    }
  }

  result = result.description(`this resources ${schema.path} field`);
  return result;
};

module.exports = {
  toJoi
};
