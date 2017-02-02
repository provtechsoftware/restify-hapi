"use strict";

const Hapi = require("hapi");
const server = new Hapi.Server();
const Logger = console;

const User = require("./tests/fixtures/User");
const Restify = require("./index.js");

server.connection({
  host: "localhost",
  port: 3000
});

const options = {
  debug: false
};
const userRoutes = Restify.restify(User, options, Logger);
server.route(userRoutes);

server.start((err) => {
  if (err) {
    throw err;
  }

  Logger.info(`Server running at: ${server.info.uri}`);
});
