"use strict";

const expect = require("chai").expect;

describe("The CreateHandler module", function() {

  it("saves a newly created User object", function (done) {
    const userPayload = this.ResourceHelper.generatePayload("User");
    const saveUserStub = this.sandbox.stub(this.User.prototype, "save", function(callback) {
      callback(null, userPayload);
    });

    this.server.inject({ method: "POST", url: "/api/v1/users", payload: userPayload }, (res) => {
      expect(saveUserStub).to.be.calledWith();
      expect(res.statusCode).to.equal(302);
      done();
    });
  });

  it("rejects a newly created User object with missing attributes", function (done) {
    let userPayload = this.ResourceHelper.generatePayload("User");
    delete userPayload.email;
    const saveUserStub = this.sandbox.stub(this.User.prototype, "save", function(callback) {
      callback(null, userPayload);
    });

    this.server.inject({ method: "POST", url: "/api/v1/users", payload: userPayload }, (res) => {
      expect(saveUserStub).to.not.be.calledWith();
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal("child \"email\" fails because [\"email\" is required]");
      done();
    });
  });

  it("rejects a newly created object with a belongsTo relationship if the reference object does not exist", function (done) {
    let userPayload = this.ResourceHelper.generatePayload("User");
    userPayload.company = 10;

    this.server.inject({ method: "POST", url: "/api/v1/users", payload: userPayload }, (res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal("Company with id=10 was not found");
      done();
    });
  });

  it("rejects a newly created object with a hasMany relationship if the reference object(s) do not exist", function (done) {
    let companyPayload = this.ResourceHelper.generatePayload("Company");
    companyPayload.employees.push(10);

    this.server.inject({ method: "POST", url: "/api/v1/companies", payload: companyPayload }, (res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal("Users with ids=10 not found");
      done();
    });
  });

});

