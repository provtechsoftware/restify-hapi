"use strict";

const expect = require("chai").expect;

describe("The FindAllHandler module", function() {

  beforeEach(function(done) {
    this.ResourceHelper.seedDatabase(this.User, 5, done);
  });

  it("fetches all resources", function(done) {
    this.server.inject({ method: "GET", "url": "/api/v1/users"}, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.have.property("_links");
      expect(res.result).to.have.property("_total");
      expect(res.result).to.have.property("_count");
      expect(res.result).to.have.property("records").that.has.lengthOf(5);
      expect(res.result).to.have.deep.property("records[0]").that.has.property("_links");
      done();
    });
  });

  it("does not populate the company on the users resources", function(done) {
    this.server.inject({ method: "GET", "url": "/api/v1/users"}, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.have.deep.property("records[0]").that.has.property("company").that.equals(0);
      done();
    });
  });

});
