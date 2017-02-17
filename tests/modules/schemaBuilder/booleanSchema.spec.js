"use strict";

const expect = require("chai").expect;

const BooleanSchema = require("../../../lib/schemaBuilder/booleanSchema");

describe("The BooleanSchema module", function() {

  it("parses a complex boolean", function() {
    const options = {};
    const schema = BooleanSchema.toJoi(this.User.schema.paths.living, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources living field");
    expect(schema._type).to.equal("boolean");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = BooleanSchema.toJoi(this.User.schema.paths.living, options, this.dispatcher);

    expect(schema._flags).to.not.have.deep.property("presence");
  });

  it("generates a valid default value if non is present", function() {
    const defaultValue = BooleanSchema.generateDefaultValue(this.User.schema.paths.ofBoolean);
    expect(defaultValue).to.equal(true);
  });

  it("applies the default value if one is given by the resource schema", function() {
    const defaultValue = BooleanSchema.generateDefaultValue(this.User.schema.paths.living);
    expect(defaultValue).to.equal(false);
  });

});
