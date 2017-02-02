"use strict";

const Joi = require("joi");

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
  toJoi
};
