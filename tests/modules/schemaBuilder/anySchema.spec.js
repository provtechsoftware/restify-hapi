"use strict";

const expect = require("chai").expect;

const AnySchema = require("../../../lib/schemaBuilder/anySchema");

describe("The AnySchema module", function() {

  it("parses a fake schema that does not match any type", function() {
    const options = {};
    const fakeSchema = {
      instance: "unknown",
      isRequired: false,
      path: "fakeSchema",
      options: {
        default: "fakeSchema"
      }
    };
    const schema = AnySchema.toJoi(fakeSchema, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources fakeSchema field");
    expect(schema._type).to.equal("any");
  });

  it("generates a valid default value if non is present", function() {
    const fakeSchema = {
      instance: "unknown",
      isRequired: false,
      path: "fakeSchema",
      options: {}
    };
    const defaultValue = AnySchema.generateDefaultValue(fakeSchema);

    expect(defaultValue).to.equal("any");
  });

  it("applies the default value if one is given by the resource schema", function() {
    const fakeSchema = {
      instance: "unknown",
      isRequired: false,
      path: "fakeSchema",
      options: {
        default: "fakeSchema"
      },
      defaultValue: "fakeSchema"
    };
    const defaultValue = AnySchema.generateDefaultValue(fakeSchema);

    expect(defaultValue).to.equal("fakeSchema");
  });

});
