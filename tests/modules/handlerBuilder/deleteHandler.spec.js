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
    const payload = [0, 1];

    this.server.inject({ method: "DELETE", url: "/api/v1/users", payload: payload }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result.result).to.deep.equal({
        "ok": 1,
        "n": 2
      });
      done();
    });
  });

});
