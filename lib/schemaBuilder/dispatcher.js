"use strict";

const AnySchema = require("./anySchema");
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

    let result = {
      schema: {},
      generateDefaultValue: null
    };

    if (!schema || !schema.instance) {
      return;
    }

    switch (schema.instance) {
    case "Array":
      result.schema = ArraySchema.toJoi(schema, options, this);
      result.generateDefaultValue = ArraySchema.generateDefaultValue;
      break;

    case "Boolean":
      result.schema = BooleanSchema.toJoi(schema, options, this);
      result.generateDefaultValue = BooleanSchema.generateDefaultValue;
      break;

    case "Buffer":
      result.schema = BufferSchema.toJoi(schema, options, this);
      result.generateDefaultValue = BufferSchema.generateDefaultValue;
      break;

    case "Date":
      result.schema = DateSchema.toJoi(schema, options, this);
      result.generateDefaultValue = DateSchema.generateDefaultValue;
      break;

    case "Mixed":
      result.schema = MixedSchema.toJoi(schema, options, this);
      result.generateDefaultValue = MixedSchema.generateDefaultValue;
      break;

    case "Number":
      result.schema = NumberSchema.toJoi(schema, options, this);
      result.generateDefaultValue = NumberSchema.generateDefaultValue;
      break;

    case "ObjectID":
      result.schema = ObjectIdSchema.toJoi(schema, options, this);
      result.generateDefaultValue = ObjectIdSchema.generateDefaultValue;
      break;

    case "String":
      result.schema = StringSchema.toJoi(schema, options, this);
      result.generateDefaultValue = StringSchema.generateDefaultValue;
      break;

    default:
      result.schema = AnySchema.toJoi(schema, options, this);
      result.generateDefaultValue = AnySchema.generateDefaultValue;
      break;
    }

    return result;
  }

}

module.exports = Dispatcher;
