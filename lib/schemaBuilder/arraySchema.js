"use strict";

const Joi = require("joi");

const toJoi = (schema, options, dispatcher) => {

  if (schema.path.indexOf("__") === 0) {
    return;
  }

  let result = Joi.array().items(dispatcher.dispatch(schema.caster, options));

  if (schema.isRequired === true && options.skipRequired !== true) {
    result = result.required();
  }

  if (schema.options.min) {
    result = result.min(schema.options.min);
  }

  if (schema.options.max) {
    result = result.max(schema.options.max);
  }

  result = result.description(`this resources ${schema.path} field`);
  return result;
};

module.exports = {
  toJoi
}