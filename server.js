"use strict";

const Hapi = require("hapi");
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");

const async = require("async");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const server = new Hapi.Server();
const Logger = console;

const Restify = require("./index.js");



/* =====  Server Connection ===== */
server.connection({
  host: "localhost",
  port: 3000
});



/* =====  Mongoose Connection ===== */
const loadMongoose = (next) => {
  const url = "mongodb://localhost:27017/restify?auto_reconnect=true";
  const db = mongoose.connection;

  mongoose.connect(url, (err) => {
    if (err) {
      Logger.error("err");
    }
  });

  mongoose.Promise = require("bluebird");

  db.on("reconnected", () => {
    Logger.error("mongoose reconnected");
  });

  db.on("error", (err) => {
    Logger.error(`mongoose error=${err}`);
  });

  db.on("parseError", (err) => {
    Logger.error(`mongoose parse error=${err}`);
  });

  db.once("open", () => {
    autoIncrement.initialize(db);
    return next();
  });
};



/* =====  Server Plugins and Start ===== */
const loadServer = (next) => {

  const swaggerOptions = {
    info: {
      "title": "API Documentation",
      "version": Pack.version
    },
    "basePath": "/api",
    "pathPrefixSize": 3
  };

  server.register([
    Inert,
    Vision,
    {
      "register": HapiSwagger,
      "options": swaggerOptions
    }
  ], next);
};



/* =====  Routes ===== */
const initRoutes = () => {
  const User = require("./tests/fixtures/User");
  const Company = require("./tests/fixtures/Company");

  const userOptions = {
    debug: false
  };

  const userRoutes = Restify.restify(User, userOptions, Logger);
  server.route(userRoutes);

  const companyOptions = {
    debug: false,
    single: "company",
    multi: "companies"
  };

  const companyRoutes = Restify.restify(Company, companyOptions, Logger);
  server.route(companyRoutes);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => {
      return reply().redirect("/documentation");
    }
  });
};



/* ===== Main ===== */
async.waterfall([
  loadMongoose,
  loadServer
], (err) => {
  if (err) {
    Logger.error(err);
  }

  server.start((err) => {
    if (err) {
      Logger.error(err);
    } else {
      Logger.info(`Server running at: ${server.info.uri}`);
      initRoutes();
    }
  });
});
