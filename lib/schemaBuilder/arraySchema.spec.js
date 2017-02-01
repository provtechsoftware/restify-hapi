"use strict";

const expect = require("chai").expect;

const arraySchema = require("./arraySchema");

describe("The arraySchema module", function() {
  it("parses a complex array", function * () {
    const options = {};
    const schema = arraySchema.toJoi(this.User.schema.paths.arrayTwo, options, this.dispatcher);

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
  });

  it("skips required if specified so in options", function * () {
    const options = {
      skipRequired: true
    };
    const schema = arraySchema.toJoi(this.User.schema.paths.arrayTwo, options, this.dispatcher);

    expect(schema._type).to.equal("array");
    expect(schema._flags).to.not.have.deep.property("presence");
  })
});