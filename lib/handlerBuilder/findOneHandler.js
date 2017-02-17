"use strict";

const Boom = require("boom");
const _ = require("lodash");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options) => {
  const params = Parser.parse(request.query, Model);

  const responseHandler = (err, dbResource) => {
    if (err) {
      logger.error(err);
      return reply(Boom.badImplementation("An internal mongodb error occured"));
    } else if (dbResource) {
      return reply(Enhancer.addMetaResource(dbResource, request.connection.info, options));
    } else {
      return reply(Boom.notFound(`${Model.modelName} with id ${request.params.id} does not exist`));
    }
  };

  const dispatchPopulates = (populate) => {
    if (populate === true) {
      const populations = _.chain(Model.schema.paths).filter((entry) => {
        if (entry.caster !== undefined) {
          return (entry.caster.options.ref !== undefined);
        } else {
          return (entry.options.ref !== undefined);
        }
      }).map((entry) => {
        return entry.path;
      }).value();

      return populations.join(" ");
    } else {
      return populate;
    }
  };

  if (options.populate !== false) {
    Model.findById(request.params.id)
      .populate(dispatchPopulates(options.populate))
      .select(params.project)
      .lean().exec(responseHandler);
  } else {
    Model.findById(request.params.id)
    .select(params.project)
    .lean().exec(responseHandler);
  }

};

module.exports = {
  exec
};
