"use strict";

const expect = require("chai").expect;

const ObjectIdSchema = require("./objectIdSchema");

describe("The ObjectIdSchema module", function() {

  it("parses a complex objectId", function() {
    const options = {};
    const schema = ObjectIdSchema.toJoi(this.User.schema.paths._id, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources _id field");
    expect(schema._type).to.equal("any");
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = ObjectIdSchema.toJoi(this.User.schema.paths._id, options, this.dispatcher);

    expect(schema._flags).to.not.have.deep.property("presence");
  });

});
