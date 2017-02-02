"use strict";

const Joi = require("joi");

const ArraySchema = require("./arraySchema");
const BooleanSchema = require("./booleanSchema");
const BufferSchema = require("./bufferSchema");
const DateSchema = require("./dateSchema");
const MixedSchema = require("./mixedSchema");
const NumberSchema = require("./numberSchema");
const ObjectIdSchema = require("./objectIdSchema");
const StringSchema = require("./stringSchema");

class Dispatcher {

  dispatch(schema, options) {

    let resultSchema;

    if (!schema || !schema.instance) {
      return;
    }

    switch (schema.instance) {
    case "Array":
      resultSchema = ArraySchema.toJoi(schema, options, this);
      break;

    case "Boolean":
      resultSchema = BooleanSchema.toJoi(schema, options, this);
      break;

    case "Buffer":
      resultSchema = BufferSchema.toJoi(schema, options, this);
      break;

    case "Date":
      resultSchema = DateSchema.toJoi(schema, options, this);
      break;

    case "Mixed":
      resultSchema = MixedSchema.toJoi(schema, options, this);
      break;

    case "Number":
      resultSchema = NumberSchema.toJoi(schema, options, this);
      break;

    case "ObjectID":
      resultSchema = ObjectIdSchema.toJoi(schema, options, this);
      break;

    case "String":
      resultSchema = StringSchema.toJoi(schema, options, this);
      break;

    default:
      resultSchema = Joi.any().description("this field could not be dispatched. Use with care!");
      break;
    }

    return resultSchema;
  }

}

module.exports = Dispatcher;
