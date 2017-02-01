"use strict";

const expect = require("chai").expect;

const stringSchema = require("./stringSchema");

describe("The stringSchema module", function() {
  it("parses a simple string", function * () {
    const options = {};
    const schema = stringSchema.toJoi(this.User.schema.paths.name, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._type).to.equal("string");
    expect(schema._description).to.equal("this resources name field");
  });

  it("parses a complex string", function * () {
    const options = {};
    const schema = stringSchema.toJoi(this.User.schema.paths.email, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
    expect(schema._tests).to.have.length(4);
    expect(schema._tests).to.have.deep.property("[0].name", "min");
    expect(schema._tests).to.have.deep.property("[0].arg", 3);
    expect(schema._tests).to.have.deep.property("[1].name", "max");
    expect(schema._tests).to.have.deep.property("[1].arg", 10);
    expect(schema._tests).to.have.deep.property("[2].name", "regex");
    expect(schema._tests).to.have.deep.property("[2].arg").that.deep.equals({ pattern: /.*/ });
    expect(schema._tests).to.have.deep.property("[3].name", "email");
  });

  it("skips required if specified so in options", function * () {
    const options = {
      skipRequired: true
    };
    const schema = stringSchema.toJoi(this.User.schema.paths.email, options);

    expect(schema._flags).to.deep.equal({});
  })
});