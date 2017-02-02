"use strict";

const expect = require("chai").expect;

const NumberSchema = require("./numberSchema");

describe("The NumberSchema module", function() {

  it("parses a complex number", function() {
    const options = {};
    const schema = NumberSchema.toJoi(this.User.schema.paths.age, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources age field");
    expect(schema._type).to.equal("number");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
    expect(schema._tests).to.have.length(2);
    expect(schema._tests).to.have.deep.property("[0].name", "min");
    expect(schema._tests).to.have.deep.property("[0].arg", 18);
    expect(schema._tests).to.have.deep.property("[1].name", "max");
    expect(schema._tests).to.have.deep.property("[1].arg", 65);
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = NumberSchema.toJoi(this.User.schema.paths.age, options, this.dispatcher);

    expect(schema._flags).to.deep.equal({});
  });

});
