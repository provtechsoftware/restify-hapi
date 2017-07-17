"use strict";

const Joi = require("joi");

const generateDefaultValue = (schema, options, dispatcher) => {
  let defaultValue = [];

  if (schema.options.default !== undefined) {
    defaultValue = schema.defaultValue();
  } else {
    const min = schema.options.min || 1;
    const childItem = dispatcher.dispatch(schema.caster, options);

    for (var i = 0; i < min; i++) {
      defaultValue.push(childItem.generateDefaultValue(schema.caster, options, dispatcher));
    }
  }

  return defaultValue;
};

const toJoi = (schema, options, dispatcher) => {

  if (schema.path.indexOf("__") === 0) {
    return;
  }

  const childItem = dispatcher.dispatch(schema.caster, options);

  let result = Joi.array().items(childItem.schema);

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
  toJoi,
  generateDefaultValue
};
