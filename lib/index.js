"use strict";

const _ = require("lodash");
const util = require("util");

const HandlerBuilder = require("./handlerBuilder");
const SchemaBuilder = require("./schemaBuilder");
const baseConfig = require("./baseConfig");

const restify = (Model, options, customLogger) => {
  let logger = console;
  let routes = [];

  if (customLogger && customLogger.info && customLogger.error) {
    logger = customLogger;
  }

  let config = baseConfig.generate(Model, options);
  _.assign(config, options);

  _.each(config.routes, (settings, action) => {
    if (settings.enabled === true) {
      if (action === "delete") {
        action = "remove";
      }

      const route = {
        method: settings.method,
        path: settings.path,
        config: {
          auth: settings.auth || config.auth,
          handler: (request, reply) => {
            HandlerBuilder[action](Model, logger, request, reply);
          },
          validate: SchemaBuilder[action](Model),
          description: settings.description,
          notes: settings.notes,
          tags: settings.tags || config.tags
        }
      };

      routes.push(route);
      if (_.includes(["create"], action)) {
        logger.info(util.inspect(route.config.validate, { depth: 4 }));
      }
    }
  });
};

module.exports = {
  restify
}