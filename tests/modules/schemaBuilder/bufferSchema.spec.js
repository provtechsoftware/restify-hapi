"use strict";

const expect = require("chai").expect;

const BufferSchema = require("../../../lib/schemaBuilder/bufferSchema");

describe("The BufferSchema module", function() {

  it("parses a complex buffer", function() {
    const options = {};
    const schema = BufferSchema.toJoi(this.User.schema.paths.binary, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources binary field");
    expect(schema._type).to.equal("binary");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = BufferSchema.toJoi(this.User.schema.paths.binary, options, this.dispatcher);

    expect(schema._flags).to.not.have.deep.property("presence");
  });

  it("generates a valid default value if non is present", function() {
    const defaultValue = BufferSchema.generateDefaultValue(this.User.schema.paths.ofBuffer);
    expect(defaultValue).to.equal("buffer");
  });

  it("applies the default value if one is given by the resource schema", function() {
    const defaultValue = BufferSchema.generateDefaultValue(this.User.schema.paths.binary);
    expect(defaultValue).to.equal("default buffer");
  });

});
