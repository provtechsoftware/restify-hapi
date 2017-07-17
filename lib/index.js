"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const HandlerBuilder = require("./handlerBuilder");
const SchemaBuilder = require("./schemaBuilder");
const BaseConfig = require("./baseConfig");

const DependenciesHandler = require("./handlerBuilder/dependenciesHandler");
const Enhancer = require("./tools/enhancer");
const Parser = require("./tools/parser");
const Security = require("./tools/security");
const Validator = require("./tools/validator");


const restify = (options, customLogger) => {
  let models = {};
  let logger = console;
  let routes = [];

  // verify for valid logger
  if (customLogger && customLogger.info && customLogger.error && customLogger.debug) {
    logger = customLogger;
  }

  // build the configurations for each model
  _.each(_.keys(options), (modelName) => {
    const Model = mongoose.model(modelName);
    if (!Model) {
      throw new Error(`mongoose model for resource=${modelName} was not found`);
    } else {
      models[Model.modelName] = Model;
    }

    let config = options[modelName];
    config.model = modelName;
    options[modelName] = BaseConfig.validateSettings(config);
  });

  // build the references and route specific configurations for each entry
  _.each(_.keys(options), (modelName) => {
    const Model = models[modelName];
    DependenciesHandler.buildReferences(Model, options);
    const config = options[modelName];

    _.each(config.routes, (routeSettings, action) => {
      // config is the root config and settings is the route config

      if (routeSettings.enabled === true) {

        if (action === "delete") {
          action = "remove";
        }

        // assign some of the root configurations to the route config
        _.assign(routeSettings, {
          prefix: config.prefix,
          single: config.single,
          multi: config.multi,
          hasMany: config.hasMany,
          references: config._references
        });

        if (_.includes(["findOne", "findAll"], action)) {
          if (routeSettings.populate === undefined) {
            if (config.populate !== undefined) {
              routeSettings.populate = config.populate;
            } else {
              routeSettings.populate = true;
            }
          }
        }
        var pref = routeSettings.pre;
        if(!pref){
          pref = function(req, reply){
            return reply();
          }
        }
        const route = {
          method: routeSettings.method,
          path: routeSettings.path,
          config: {
            auth: routeSettings.auth || config.auth,
            handler: (request, reply) => {
              HandlerBuilder[action](Model, logger, request, reply, routeSettings, options);
            },
            pre: [ {method:pref, assign:'pre' } ],
            validate: SchemaBuilder[action](Model, routeSettings),
            description: routeSettings.description,
            notes: routeSettings.notes,
            tags: config.tags
          }
        };

        routes.push(route);
      }

      return true;
    });

    return true;
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
