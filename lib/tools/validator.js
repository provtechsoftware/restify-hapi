"use strict";

const _ = require("lodash");

const validatePassword = (password, options) => {
  let error = null;

  if (password.length < options.minlength) {
    error = `password must contain at least ${options.minlength} characters`;
  }

  if (options.numbers === true && !/[0-9]/.test(password)) {
    error = "password must contain at least one number";
  }

  if (options.uppercase === true && !/[A-Z]/.test(password)) {
    error = "password must contain at least one uppercase letter";
  }

  if (options.special === true && !/\W+/.test(password)) {
    error = "password must contain at least one special character";
  }

  return error;
};

const generateRandomPassword = () => {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specials = "$!%&£";

  return _.sampleSize(uppers, 1).join("") +
    _.sampleSize(lowers, 5).join("") +
    _.sampleSize(numbers, 1).join("") +
    _.sampleSize(specials, 1).join("");
};

module.exports = {
  validatePassword,
  generateRandomPassword
};
