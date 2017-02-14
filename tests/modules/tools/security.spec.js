"use strict";

const expect = require("chai").expect;

const Security = require("../../../lib/tools/security");

describe("The Security module", function() {

  it("encrypts a password", function() {
    const password = "$Password1";
    Security.hashPassword(password, (err, encryptedPassword) => {
      expect(err).to.equal(undefined);
      expect(encryptedPassword).to.not.equal(password);
    });
  });

  it("compares equal passwords correctly", function() {
    const password = "$Password1";
    Security.hashPassword(password, (err, encryptedPassword) => {
      expect(err).to.equal(undefined);
      Security.comparePasswords(encryptedPassword, password, (err, valid) => {
        expect(err).to.equal(undefined);
        expect(valid).to.equal(true);
      });
    });
  });

  it("compares different passwords correctly", function() {
    const password1 = "$Password1";
    const password2 = "$Password2";
    Security.hashPassword(password1, (err, encryptedPassword) => {
      expect(err).to.equal(undefined);
      Security.comparePasswords(encryptedPassword, password2, (err, valid) => {
        expect(err).to.equal(undefined);
        expect(valid).to.equal(false);
      });
    });
  });

});
