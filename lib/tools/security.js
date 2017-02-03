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

module.exports = {
  hashPassword
};
