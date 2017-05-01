"use strict";

const expect = require("chai").expect;
const Security = require("../../../lib/tools/security");

describe("The UpdateHandler module", function() {

  beforeEach(function(done) {
    this.ResourceHelper.seedDatabase(this.User, 2, done);
  });

  it("updates the name of a user", function(done) {
    this.User.findById(0, (err, user) => {
      expect(err).to.equal(null);
      expect(user.name).to.not.equal("John Doe");

      const fields = {
        name: "John Doe"
      };

      this.server.inject({ method: "PUT", url: "/api/v1/users/0", payload: fields}, (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.have.property("name").that.equals(fields.name);
        done();
      });
    });
  });

  it("updates the password of a user", function(done) {
    const fields = {
      password: "$Password2"
    };

    this.server.inject({ method: "PUT", url: "/api/v1/users/0", payload: fields}, (res) => {
      expect(res.statusCode).to.equal(200);

      const encryptedPassword = res.result.password;
      const password = fields.password;

      Security.comparePasswords(password, encryptedPassword, (err, valid) => {
        expect(err).to.equal(null);
        expect(valid).to.equal(true);
        done();
      });
    });
  });

  it("updates a set of users", function(done) {
    const fields = [
      {
        id: 0,
        name: "John Doe 1"
      },
      {
        id: 1,
        name: "John Doe 2"
      }
    ];

    this.server.inject({ method: "PUT", url: "/api/v1/users", payload: fields}, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.have.deep.property("records[0]").that.has.property("name").that.equals("John Doe 1");
      expect(res.result).to.have.deep.property("records[1]").that.has.property("name").that.equals("John Doe 2");
      done();
    });
  });

  it("rejects the update of an object with a belongsTo relationship if the reference object does not exist", function(done) {
    const fields = {
      company: 10
    };

    this.server.inject({ method: "PUT", url: "/api/v1/users/0", payload: fields}, (res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal("Company with id=10 was not found");
      done();
    });
  });

  it("rejects the update of an object with a hasMany relationship if the reference object(s) do not exist", function(done) {
    const fields = {
      employees: [10]
    };

    this.server.inject({ method: "PUT", url: "/api/v1/companies/0", payload: fields}, (res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.result.message).to.equal("User with id=10 was not found");
      done();
    });
  });

});
