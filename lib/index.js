"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const HandlerBuilder = require("./handlerBuilder");
const SchemaBuilder = require("./schemaBuilder");
const BaseConfig = require("./baseConfig");

const Enhancer = require("./tools/enhancer");
const Parser = require("./tools/parser");
const Security = require("./tools/security");
const Validator = require("./tools/validator");

// verify that the passed or preconfigured archive.attribute fields exist
// on the targeted resources
const verifyArchiveSettings = (Model, settings, type) => {
  if (settings.archive && settings.archive.enabled === true) {
    const archiveField = settings.archive.attribute;

    // on the resource itselfe
    if (type === "origin") {
      if (!Model.schema.paths[archiveField]) {
        throw new Error("archive field=" + archiveField + " is not defined on model=" + Model.modelName);
      }
    } else if (type === "reference") { // on the resources hasMany reference
      if (!Model.schema.paths[settings.fieldName]) {
        throw new Error("invalid hasMany fieldName=" + settings.fieldName + " for model=" + Model.modelName);
      } else if (!Model.schema.paths[settings.fieldName].caster.options.ref) {
        throw new Error("invalid reference configuration for fieldName=" + settings.fieldName + " for model=" + Model.name);
      } else {
        const ReferenceModel = mongoose.model(Model.schema.paths[settings.fieldName].caster.options.ref);
        verifyArchiveSettings(ReferenceModel, settings, "origin");
      }
    }
  }
};

const restify = (Model, options, customLogger) => {
  let logger = console;
  let routes = [];

  if (customLogger && customLogger.info && customLogger.error && customLogger.debug) {
    logger = customLogger;
  }

  const config = BaseConfig.validateUserSettings(Model, options);

  verifyArchiveSettings(Model, config, "origin");
  if (config.hasMany) {
    _.each(_.filter(config.hasMany, "archive.enabled"), (entry) => {
      verifyArchiveSettings(Model, entry, "reference");
    });
  }

  _.each(config.routes, (settings, action) => {
    // config is the root config and settings is the route config

    if (settings.enabled === true) {

      if (action === "delete") {
        action = "remove";
      }

      // assign some of the root configurations to the route config
      _.assign(settings, {
        prefix: config.prefix,
        single: config.single,
        multi: config.multi,
        hasMany: config.hasMany
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
          validate: SchemaBuilder[action](Model, settings),
          description: settings.description,
          notes: settings.notes,
          tags: config.tags
        }
      };

      routes.push(route);
    }
  });

  return routes;
};

module.exports = {
  restify,
  Enhancer,
  Parser,
  Security,
  Validator
};
