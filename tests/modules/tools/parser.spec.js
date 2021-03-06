"use strict";

const expect = require("chai").expect;

const Parser = require("../../../lib/tools/parser");

const dispatchQuery = (result) => {
  return result.params;
};

describe("The Parser module", function() {

  it("generates the default limit and offset paging parameters", function() {
    const params = {};
    const options = {};
    const query = dispatchQuery(Parser.parse(params, this.User, options));

    expect(query).to.have.property("offset").that.equals(0);
    expect(query).to.have.property("limit").that.equals(1000);
  });

  it("parses the given limit and offset paging parameters", function() {
    const params = {
      "offset": 10,
      "limit": 500
    };
    const options = {};
    const query = dispatchQuery(Parser.parse(params, this.User, options));

    expect(query).to.have.property("offset").that.equals(10);
    expect(query).to.have.property("limit").that.equals(500);
  });

  it("generates the default sort, project, and query parameters", function() {
    const params = {};
    const options = {};
    const query = dispatchQuery(Parser.parse(params, this.User, options));

    expect(query).to.have.property("sort").that.deep.equals({});
    expect(query).to.have.property("project").that.deep.equals({});
    expect(query).to.have.property("query").that.deep.equals({_archived: false});
  });

  it("parses the given sort parameters", function() {
    const params = {
      "sort": "-name,age"
    };
    const options = {};
    const query = dispatchQuery(Parser.parse(params, this.User, options));

    expect(query).to.have.property("sort").that.deep.equals({
      "name": -1,
      "age": 1
    });
  });

  it("parses the given project parameters", function() {
    const params = {
      "project": "-name,age"
    };
    const options = {};
    const query = dispatchQuery(Parser.parse(params, this.User, options));

    expect(query).to.have.property("project").that.deep.equals({
      "name": false,
      "age": true
    });
  });

  it("parses the given query parameters", function() {
    const params = {
      "nameQuery": "name",
      "emailQuery": "email",
      "ageQuery": "age",
      "shouldNotPassQuery": "shouldNotPass"
    };
    const options = {};
    const query = dispatchQuery(Parser.parse(params, this.User, options));

    expect(query).to.have.property("query").that.deep.equals({
      name: "name",
      email: "email",
      age: "age",
      _archived: false
    });
  });

});
