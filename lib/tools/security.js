"use strict";

const bcrypt = require("bcrypt");

const hashPassword = (password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return callback(err);
    } else {
      bcrypt.hash(password, salt, callback);
    }
  });
};

const comparePasswords = (passwordOld, passwordNew, callback) => {
  bcrypt.compare(passwordOld, passwordNew, (err, valid) => {
    if (err) {
      callback(err, false);
    } else if (valid) {
      callback(null, true);
    } else {
      callback("Incorrect password", false);
    }
  });
};

module.exports = {
  hashPassword,
  comparePasswords
};
