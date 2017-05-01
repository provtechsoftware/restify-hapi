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

const comparePasswords = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, valid) => {
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
