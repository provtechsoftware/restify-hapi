"use strict";

const expect = require("chai").expect;

describe("The DeleteHandler module", function() {

  beforeEach(function(done) {
    this.ResourceHelper.seedDatabase(this.User, 5, done);
  });

  it("removes an existing resource", function(done) {
    this.server.inject({ method: "DELETE", url: "/api/v1/users/0" }, (res) => {
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

  it("does not remove a non existing resource", function(done) {
    this.server.inject({ method: "DELETE", url: "/api/v1/users/100" }, (res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.result.message).to.equal("User with id 100 was not found and could not be deleted");
      done();
    });
  });

  it("removes a list of resources", function(done) {
    const payload = [0, 1, 2, 3, 4, 5];

    this.server.inject({ method: "DELETE", url: "/api/v1/users", payload: payload }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result.result).to.deep.equal({
        "ok": 1,
        "n": 5
      });
      done();
    });
  });

  it("removes a list of resources with the related reference object if destroy is set to true", function(done) {
    const companies = [0];
    const payload = {
      employees: [3,4]
    };

    this.server.inject({ method: "PUT", url: "/api/v1/companies/0", payload: payload}, (res) => {
      expect(res.statusCode).to.equal(200);

      this.server.inject({ method: "DELETE", url: "/api/v1/companies", payload: companies}, (res) => {
        expect(res.statusCode).to.equal(200);

        this.server.inject({ method: "GET", url: "/api/v1/users?_idQuery=[3,4]"}, (res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.result).to.have.property("records").that.has.lengthOf(0);

          this.User.findById(3).lean().exec((err, user) => {
            expect(err).to.be.equal(null);
            expect(user._archived).to.equal(true);

            done();
          });
        });
      });
    });
  });

});
