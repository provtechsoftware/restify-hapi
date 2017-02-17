"use strict";

const expect = require("chai").expect;

const MixedSchema = require("../../../lib/schemaBuilder/mixedSchema");

describe("The MixedSchema module", function() {

  it("parses a complex mixed", function() {
    const options = {};
    const schema = MixedSchema.toJoi(this.User.schema.paths.mixed, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources mixed field");
    expect(schema._type).to.equal("any");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = MixedSchema.toJoi(this.User.schema.paths._id, options, this.dispatcher);

    expect(schema._flags).to.not.have.deep.property("presence");
  });

  it("generates a valid default value if non is present", function() {
    const schema = {
      path: "mixed",
      isRequired: false,
      options: {},
    };
    const defaultValue = MixedSchema.generateDefaultValue(schema);

    expect(defaultValue).to.equal("mixed");
  });

  it("applies the default value if one is given by the resource schema", function() {
    const schema = {
      path: "mixed",
      isRequired: false,
      options: {
        default: "default mixed value"
      },
      defaultValue: "default mixed value"
    };
    const defaultValue = MixedSchema.generateDefaultValue(schema);

    expect(defaultValue).to.equal("default mixed value");
  });

});
