"use strict";

const expect = require("chai").expect;

describe("The DeleteHandler module", function() {

  // beforeEach(function(done) {
  //   // const User = require("../../tests/fixtures/User");
  //   const User = require("mongoose").model("User");
  //   this.seedDatabase(User, done);
  // });

  it("removes an existing resource", function(done) {
    const userPayload = this.generatePayload("User");
    const saveUserStub = this.sandbox.stub(this.User.Query.base, "findOneAndRemove", function(callback) {
      callback(null, userPayload);
    });

    this.server.inject({ method: "DELETE", url: "/api/v1/users/0" }, (res) => {
      expect(saveUserStub).to.be.calledWith();
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

  it("does not remove a non existing resource", function(done) {
    this.server.inject({ method: "DELETE", url: "/api/v1/users/0" }, (res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.result.message).to.equal("User with id 0 was not found and could not be deleted");
      done();
    });
  });

  it("removes a list of resources", function(done) {
    const payload = [0, 1];

    this.server.inject({ method: "DELETE", url: "/api/v1/users", payload: payload }, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result.result).to.deep.equal({
        "ok": 1,
        "n": 0
      });
      done();
    });
  });

});
