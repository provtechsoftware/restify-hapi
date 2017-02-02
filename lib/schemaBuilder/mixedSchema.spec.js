"use strict";

const expect = require("chai").expect;

const MixedSchema = require("./mixedSchema");

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

});
