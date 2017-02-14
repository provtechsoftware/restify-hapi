"use strict";

const expect = require("chai").expect;

describe("The FindOneHandler module", function() {

  beforeEach(function(done) {
    this.ResourceHelper.seedDatabase(this.Company, 1, done);
  });

  it("fetches one resource", function (done) {
    this.server.inject({ method: "GET", "url": "/api/v1/companies/0"}, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.have.property("_id").that.equals(0);
      done();
    });
  });

});
