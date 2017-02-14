"use strict";

const expect = require("chai").expect;

const ArraySchema = require("../../../lib/schemaBuilder/arraySchema");

describe("The ArraySchema module", function() {

  it("parses a complex array", function() {
    const options = {};
    const schema = ArraySchema.toJoi(this.User.schema.paths.arrayTwo, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources arrayTwo field");
    expect(schema._type).to.equal("array");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
    expect(schema._tests).to.have.length(2);
    expect(schema._tests).to.have.deep.property("[0].name", "min");
    expect(schema._tests).to.have.deep.property("[0].arg", 2);
    expect(schema._tests).to.have.deep.property("[1].name", "max");
    expect(schema._tests).to.have.deep.property("[1].arg", 5);
    expect(schema._inner.items[0].isJoi).to.equal(true);
    expect(schema._inner.items[0]._type).to.equal("any");
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = ArraySchema.toJoi(this.User.schema.paths.arrayTwo, options, this.dispatcher);

    expect(schema._type).to.equal("array");
    expect(schema._flags).to.not.have.deep.property("presence");
  });

});
