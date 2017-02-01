"use strict";

const Joi = require("joi");

const toJoi = (schema, options, dispatcher) => {
  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.boolean();

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  result = result.description(`this resources ${schema.path} field`);
  return result;
};

module.exports = {
  toJoi
}