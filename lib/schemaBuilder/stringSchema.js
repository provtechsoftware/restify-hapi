"use strict";

const Joi = require("joi");

const toJoi = (schema, options, dispatcher) => {
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

  if (lowPath.indexOf("token") > -1) {
    result = result.token();
  } else if (lowPath.indexOf("base64") > -1) {
    result = result.base64();
  } else if (lowPath.indexOf("email") > -1) {
    result = result.email();
  }

  result = result.description(`this resources ${schema.path} field`);
  return result;
};

module.exports = {
  toJoi
}