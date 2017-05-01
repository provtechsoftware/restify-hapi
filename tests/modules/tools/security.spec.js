"use strict";

const expect = require("chai").expect;

const Security = require("../../../lib/tools/security");

describe("The Security module", function() {

  it("encrypts a password", function(done) {
    const password = "$Password1";
    Security.hashPassword(password, (err, encryptedPassword) => {
      expect(err).to.equal(undefined);
      expect(encryptedPassword).to.not.equal(password);
      done();
    });
  });

  it("compares equal passwords correctly", function(done) {
    const password = "$Password1";
    Security.hashPassword(password, (err, encryptedPassword) => {
      expect(err).to.equal(undefined);
      Security.comparePasswords(password, encryptedPassword, (err, valid) => {
        expect(err).to.equal(null);
        expect(valid).to.equal(true);
        done();
      });
    });
  });

  it("compares different passwords correctly", function(done) {
    const password1 = "$Password1";
    const password2 = "$Password2";
    Security.hashPassword(password1, (err, encryptedPassword) => {
      expect(err).to.equal(undefined);
      Security.comparePasswords(password2, encryptedPassword, (err, valid) => {
        expect(err).to.equal("Incorrect password");
        expect(valid).to.equal(false);
        done();
      });
    });
  });

});
