"use strict";

const arraySchema = require("./arraySchema");
const booleanSchema = require("./booleanSchema");
const bufferSchema = require("./bufferSchema");
const dateSchema = require("./dateSchema");
const mixedSchema = require("./mixedSchema");
const numberSchema = require("./numberSchema");
const objectIdSchema = require("./objectIdSchema");
const stringSchema = require("./stringSchema");

class Dispatcher {

  dispatch(schema, options) {

    let resultSchema;

    if (!schema || !schema.instance) {
      return;
    }

    switch (schema.instance) {
      case "Array":
        resultSchema = arraySchema.toJoi(schema, options, this);
        break;

      case "Boolean":
        resultSchema = booleanSchema.toJoi(schema, options, this);
        break;

      case "Buffer":
        resultSchema = bufferSchema.toJoi(schema, options, this);
        break;

      case "Date":
        resultSchema = dateSchema.toJoi(schema, options, this);
        break;

      case "Mixed":
        resultSchema = mixedSchema.toJoi(schema, options, this);
        break;

      case "Number":
        resultSchema = numberSchema.toJoi(schema, options, this);
        break;

      case "ObjectID":
        resultSchema = objectIdSchema.toJoi(schema, options, this);
        break;

      case "String":
        resultSchema = stringSchema.toJoi(schema, options, this);
        break;

      default:
        resultSchema = Joi.any().description("this field could not be dispatched. Use with care!");
        break;
    }

    return resultSchema;
  };
}

module.exports = Dispatcher;