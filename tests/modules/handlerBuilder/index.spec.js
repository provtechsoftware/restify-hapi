"use strict";

const expect = require("chai").expect;
const HandlerBuilder = require("../../../lib/handlerBuilder/index");

describe("The HandlerBuilder module", function() {

  it("exports the findAll handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("findAll");
  });

  it("exports the findOne handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("findOne");
  });

  it("exports the create handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("create");
  });

  it("exports the update handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("update");
  });

  it("exports the bulkUpdate handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("bulkUpdate");
  });

  it("exports the delete handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("remove");
  });

  it("exports the bulkDelete handler for the resource", function() {
    expect(HandlerBuilder).to.have.property("bulkDelete");
  });

});
