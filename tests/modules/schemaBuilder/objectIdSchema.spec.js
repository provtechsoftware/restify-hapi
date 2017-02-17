"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");

const ObjectIdSchema = require("../../../lib/schemaBuilder/objectIdSchema");

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

  it("generates a valid default value if non is present", function() {
    const schema = {
      path: "objectId",
      isRequired: false,
      options: {},
    };
    const defaultValue = ObjectIdSchema.generateDefaultValue(schema);

    expect(mongoose.Types.ObjectId.isValid(defaultValue)).to.equal(true);
  });

  it("applies the default value if one is given by the resource schema", function() {
    const defaultObjectId = mongoose.Types.ObjectId();
    const schema = {
      path: "objectId",
      isRequired: false,
      options: {
        default: defaultObjectId
      },
      defaultValue: defaultObjectId
    };
    const defaultValue = ObjectIdSchema.generateDefaultValue(schema);

    expect(defaultValue).to.equal(defaultObjectId);
  });

});
