"use strict";

const validatePassword = (password, options) => {
  let error = null;

  if (password.length < options.minlength) {
    error = "password must contain at least 8 characters";
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

module.exports = {
  validatePassword
};
