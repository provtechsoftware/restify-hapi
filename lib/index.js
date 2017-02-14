"use strict";

const _ = require("lodash");

const HandlerBuilder = require("./handlerBuilder");
const SchemaBuilder = require("./schemaBuilder");
const BaseConfig = require("./baseConfig");

const restify = (Model, options, customLogger) => {
  let logger = console;
  let routes = [];

  if (customLogger && customLogger.info && customLogger.error && customLogger.debug) {
    logger = customLogger;
  }

  let config = BaseConfig.generate(Model, options);
  _.merge(config, options);

  _.each(config.routes, (settings, action) => {

    if (settings.enabled === true) {

      if (action === "delete") {
        action = "remove";
      }

      _.assign(settings, {
        prefix: config.prefix,
        single: config.single,
        multi: config.multi
      });

      if (_.includes(["findOne", "findAll"], action)) {
        if (settings.populate === undefined) {
          if (config.populate !== undefined) {
            settings.populate = config.populate;
          } else {
            settings.populate = true;
          }
        }
      }

      const route = {
        method: settings.method,
        path: settings.path,
        config: {
          auth: settings.auth || config.auth,
          handler: (request, reply) => {
            HandlerBuilder[action](Model, logger, request, reply, settings);
          },
          validate: SchemaBuilder[action](Model),
          description: settings.description,
          notes: settings.notes,
          tags: settings.tags || config.tags
        }
      };

      routes.push(route);
    }
  });

  return routes;
};

module.exports = {
  restify
};
