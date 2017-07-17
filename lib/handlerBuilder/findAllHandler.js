"use strict";

const async = require("async");
const Boom = require("boom");
const _ = require("lodash");

const DependenciesHandler = require("./dependenciesHandler");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options, globalOptions) => {
  const result = Parser.parse(request.query, Model, options);
  const valid = result.valid;
  const params = result.params;
  const error = result.err;

  if(request.pre.pre){
    params.query = request.pre.pre;
  }

  if (!valid) {
    return reply(Boom.badRequest(error));
  }

  const dbOptions = {
    skip: params.offset,
    limit: params.limit
  };

  const responseHandler = (err, dbResources, next) => {
    if (err) {
      logger.error(err);
    }

    if (options.populate === true) {
      const connectionInfo = request.connection.info;
      let fieldName, referenceModelOptions;

      _.each(options.references.belongsTo, (belongsToSetting) => {
        fieldName = belongsToSetting.fieldName;
        referenceModelOptions = globalOptions[belongsToSetting.referenceModel];

        dbResources = _.map(dbResources, (dbResource) => {
          dbResource[fieldName] = Enhancer.addMetaResource(dbResource[fieldName], connectionInfo, referenceModelOptions);
          return dbResource;
        });
      });

      _.each(options.references.hasMany, (hasManySetting) => {
        fieldName = hasManySetting.fieldName;
        referenceModelOptions = globalOptions[hasManySetting.referenceModel];

        dbResources = _.map(dbResources, (dbResource) => {
          dbResource[fieldName] = _.map(dbResource[fieldName], (resource) => {
            return Enhancer.addMetaResource(resource, connectionInfo, referenceModelOptions);
          });
          return dbResource;
        });
      });
    }

    return next(err, dbResources);
  };

  const execQuery = (next) => {
    Model.find(params.query, params.project, dbOptions).sort(params.sort)
      .populate(DependenciesHandler.generatePopulationSettings(options))
      .lean().exec((err, dbResources) =>
        responseHandler(err, dbResources, next));
  };

  const execCount = (next) => {
    Model.count(params.query).lean().exec(next);
  };

  async.parallel([
    execQuery,
    execCount
  ], (err, results) => {
    if (err) {
      logger.error(err);
      return reply(Boom.badImplementation(err));
    } else {
      params.total = results[1];

      if (request.query.raw === true) {
        return reply(results[0]);
      }

      return reply(Enhancer.addMetaCollection(results[0], params, request.connection.info, options));
    }
  });

};

module.exports = {
  exec
};
