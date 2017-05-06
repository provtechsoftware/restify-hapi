"use strict";

const Hapi = require("hapi");
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("../package");

const async = require("async");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const server = new Hapi.Server();
const Logger = console;

const Restify = require("../index.js");

let port = 3000;
if (process.env.NODE_ENV === "test") {
  port = 3001;
}

/* =====  Server Connection ===== */
server.connection({
  host: "localhost",
  port: port
});



/* =====  Mongoose Connection ===== */
const loadMongoose = (next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }

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
  // first require all mongoose models because they might be referenced
  // in the restify method
  require("./fixtures/User");
  require("./fixtures/Company");

  const options = {
    User: {
      routes: {
        findAll: {
          populate: false
        }
      }
    },
    Company: {
      single: "company",
      multi: "companies",
      hasMany: [
        // employees (users) are destroyed when this company is destroyed
        // however in this case we apply the archive policy. This means
        // that we do not remove the resources but mark them as _archived=true
        {
          fieldName: "employees",
          destroy: true,
          archive: {
            enabled: true
          }
        }
      ]
    }
  };

  server.route(Restify.restify(options, Logger));

  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => {
      return reply.redirect("/documentation");
    }
  });
};

/* ===== Main ===== */
const start = (callback) => {

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
        if (callback) {
          return callback(server);
        } else {
          return;
        }
      }
    });
  });
};

if (!module.parent) {
  start();
}

module.exports = {
  start
};
