"use strict";

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

  if (!valid) {
    return reply(Boom.badRequest(error));
  }

  const responseHandler = (err, dbResource) => {
    if (err) {
      logger.error(err);
      return reply(Boom.badImplementation("An internal mongodb error occured"));
    } else if (dbResource) {

      if (options.populate === true) {
        const connectionInfo = request.connection.info;
        let fieldName, referenceModelOptions;

        _.each(options.references.belongsTo, (belongsToSetting) => {
          fieldName = belongsToSetting.fieldName;
          referenceModelOptions = globalOptions[belongsToSetting.referenceModel];
          dbResource[fieldName] = Enhancer.addMetaResource(dbResource[fieldName], connectionInfo, referenceModelOptions);
        });

        _.each(options.references.hasMany, (hasManySetting) => {
          fieldName = hasManySetting.fieldName;
          referenceModelOptions = globalOptions[hasManySetting.referenceModel];

          dbResource[fieldName] = _.map(dbResource[fieldName], (resource) => {
            return Enhancer.addMetaResource(resource, connectionInfo, referenceModelOptions);
          });
        });
      }

      if (request.query.raw === true) {
        return reply(dbResource);
      }

      return reply(Enhancer.addMetaResource(dbResource, request.connection.info, options));
    } else {
      return reply(Boom.notFound(`${Model.modelName} with id ${request.params.id} does not exist`));
    }
  };

  params.query._id = request.params.id;
  Model.findOne(params.query)
    .populate(DependenciesHandler.generatePopulationSettings(options))
    .select(params.project)
    .lean().exec(responseHandler);
};

module.exports = {
  exec
};
