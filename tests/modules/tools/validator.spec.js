"use strict";

const expect = require("chai").expect;

const Validator = require("../../../lib/tools/validator");

let passwordValidatorSettings = {
  "minlength": 8,
  "numbers": false,
  "uppercase": false,
  "special": false
};

const password1 = "password";
const password2 = "$Password1";

describe("The Validator module", function() {

  it("rejects too short passwords", function() {
    passwordValidatorSettings.minlength = 10;
    const passwordError = Validator.validatePassword(password1, passwordValidatorSettings);

    expect(passwordError).to.equal(`password must contain at least ${passwordValidatorSettings.minlength} characters`);
  });

  it("rejects passwords without numbers if required", function() {
    passwordValidatorSettings.minlength = 8;
    passwordValidatorSettings.numbers = true;
    const passwordError = Validator.validatePassword(password1, passwordValidatorSettings);
    const passwordCorrect = Validator.validatePassword(password2, passwordValidatorSettings);

    expect(passwordError).to.equal("password must contain at least one number");
    expect(passwordCorrect).to.equal(null);
  });

  it("rejects lowercase passwords if required", function() {
    passwordValidatorSettings.numbers = false;
    passwordValidatorSettings.uppercase = true;
    const passwordError = Validator.validatePassword(password1, passwordValidatorSettings);
    const passwordCorrect = Validator.validatePassword(password2, passwordValidatorSettings);

    expect(passwordError).to.equal("password must contain at least one uppercase letter");
    expect(passwordCorrect).to.equal(null);
  });

  it("rejects passwords without special characters if required", function() {
    passwordValidatorSettings.uppercase = false;
    passwordValidatorSettings.special = true;
    const passwordError = Validator.validatePassword(password1, passwordValidatorSettings);
    const passwordCorrect = Validator.validatePassword(password2, passwordValidatorSettings);

    expect(passwordError).to.equal("password must contain at least one special character");
    expect(passwordCorrect).to.equal(null);
  });

});
