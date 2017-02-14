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

});
