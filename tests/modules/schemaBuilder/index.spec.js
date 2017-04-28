"use strict";

const expect = require("chai").expect;
const SchemaBuilder = require("../../../lib/schemaBuilder/index");

describe("The SchemaBuilder module", function() {

  it("generates the findAll schema for the User model", function() {
    const schema = SchemaBuilder.findAll(this.User);
    const query = schema.query;
    const children = query._inner.children;

    expect(query.isJoi).to.equal(true);
    expect(query._type).to.equal("object");
    expect(children).to.have.length(14);
    expect(children).to.have.deep.property("[0].key", "offset");
    expect(children).to.have.deep.property("[1].key", "limit");
    expect(children).to.have.deep.property("[2].key", "sort");
    expect(children).to.have.deep.property("[3].key", "project");
    expect(children).to.have.deep.property("[4].key", "nameQuery");
    expect(children).to.have.deep.property("[5].key", "emailQuery");
    expect(children).to.have.deep.property("[6].key", "livingQuery");
    expect(children).to.have.deep.property("[7].key", "passwordQuery");
    expect(children).to.have.deep.property("[8].key", "updatedQuery");
    expect(children).to.have.deep.property("[9].key", "ageQuery");
    expect(children).to.have.deep.property("[10].key", "nested.stuffQuery");
    expect(children).to.have.deep.property("[11].key", "nested.otherStuffQuery");
    expect(children).to.have.deep.property("[12].key", "companyQuery");
  });

  it("generates the findOne schema for the User model", function() {
    const schema = SchemaBuilder.findOne(this.User);
    const params = schema.params;
    const children = params._inner.children;

    expect(params.isJoi).to.equal(true);
    expect(params._type).to.equal("object");
    expect(children).to.have.length(1);
    expect(children).to.have.deep.property("[0].key", "id");
  });

  it("generates the create schema for the User model", function() {
    const schema = SchemaBuilder.create(this.User);
    const payload = schema.payload;
    const children = payload._inner.children;

    expect(payload.isJoi).to.equal(true);
    expect(payload._type).to.equal("object");
    expect(children).to.have.length(20);
    expect(children).to.not.have.deep.property("[0].key", "id");
  });

  it("generates the update schema for the User model", function() {
    const schema = SchemaBuilder.update(this.User);
    const params = schema.params;
    const paramsChildren = params._inner.children;
    const payload = schema.payload;
    const children = payload._inner.children;

    expect(params.isJoi).to.equal(true);
    expect(params._type).to.equal("object");
    expect(paramsChildren).to.have.length(1);
    expect(paramsChildren).to.have.deep.property("[0].key", "id");

    expect(payload.isJoi).to.equal(true);
    expect(payload._type).to.equal("object");
    expect(children).to.have.length(20);
    expect(children).to.not.have.deep.property("[0].key", "id");
  });

  it("generates the bulkUpdate schema for the User model", function() {
    const schema = SchemaBuilder.bulkUpdate(this.User);
    const payload = schema.payload;
    const items = payload._inner.items;
    const itemPayload = items[0];
    const children = itemPayload._inner.children;

    expect(payload.isJoi).to.equal(true);
    expect(payload._type).to.equal("array");
    expect(children).to.have.length(21);
    expect(children).to.not.have.deep.property("[0].key", "id");
  });

  it("generates the delete schema for the User model", function() {
    const schema = SchemaBuilder.remove(this.User);
    const params = schema.params;
    const children = params._inner.children;

    expect(params.isJoi).to.equal(true);
    expect(params._type).to.equal("object");
    expect(children).to.have.length(1);
    expect(children).to.have.deep.property("[0].key", "id");
  });

  it("generates the bulkDelete schema for the User model", function() {
    const schema = SchemaBuilder.bulkDelete(this.User);
    const payload = schema.payload;
    const items = payload._inner.items;
    const itemPayload = items[0];

    expect(payload.isJoi).to.equal(true);
    expect(payload._type).to.equal("array");
    expect(itemPayload._type).to.equal("number");
  });

});
