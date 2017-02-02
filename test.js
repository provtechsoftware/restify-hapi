const User = require("./tests/fixtures/User");
const Restify = require("./index.js");

Restify.restify(User, {}, console);
