"use strict";

const expect = require("chai").expect;

describe("The FindOneHandler module", function() {

  beforeEach(function(done) {
    this.ResourceHelper.seedDatabase(this.User, 1, done);
  });

  it("fetches one resource", function (done) {
    this.server.inject({ method: "GET", "url": "/api/v1/users/0"}, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.have.property("_id").that.equals(0);
      done();
    });
  });

  it("populates the company on the user resource", function (done) {
    this.Company.findById(0, (err, company) => {
      expect(err).to.equal(null);

      this.server.inject({ method: "GET", "url": "/api/v1/users/0"}, (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.have.deep.property("company.name").that.equals(company.name);
        done();
      });
    });
  });

});
