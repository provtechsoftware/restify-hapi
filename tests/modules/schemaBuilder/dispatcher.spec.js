"use strict";

const expect = require("chai").expect;

describe("The Dispatcher module", function() {

  it("parses an array of strings", function() {
    const options = {};
    const schema = this.dispatcher.dispatch(this.User.schema.paths.ofString, options).schema;

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources ofString field");
    expect(schema._type).to.equal("array");
    expect(schema._flags).to.not.have.property("presence");
    expect(schema._inner.items[0].isJoi).to.equal(true);
    expect(schema._inner.items[0]._type).to.equal("string");
  });

  it("handles an unknown instance type correctly", function() {
    const options = {};
    const fakeSchema = {
      instance: "unknown",
      isRequired: false,
      path: "fakeSchema",
      options: {
        default: "fakeSchema"
      }
    };
    const schema = this.dispatcher.dispatch(fakeSchema, options).schema;

    expect(schema.isJoi).to.equal(true);
    expect(schema._description).to.equal("this resources fakeSchema field");
    expect(schema._type).to.equal("any");
  });

});
