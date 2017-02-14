"use strict";

const expect = require("chai").expect;

const DateSchema = require("../../../lib/schemaBuilder/dateSchema");

describe("The DateSchema module", function() {

  it("parses a complex date", function() {
    const options = {};
    const schema = DateSchema.toJoi(this.User.schema.paths.updated, options, this.dispatcher);
    const now = new Date("2017-01-01");

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources updated field");
    expect(schema._type).to.equal("date");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
    expect(schema._tests).to.have.length(1);
    expect(schema._tests).to.have.deep.property("[0].name", "min");
    expect(schema._tests[0].arg.getTime()).to.equal(now.getTime());
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = DateSchema.toJoi(this.User.schema.paths.updated, options, this.dispatcher);

    expect(schema._flags).to.deep.equal({});
  });

});
