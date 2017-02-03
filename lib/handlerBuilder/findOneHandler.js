"use strict";

const Boom = require("boom");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options) => {
  const params = Parser.parse(request.query, Model);

  Model.findById(request.params.id).select(params.project).lean().exec((err, dbResource) => {
    if (err) {
      logger.error(err);
      return reply(Boom.badImplementation("An internal mongodb error occured"));
    } else if (dbResource) {
      return reply(Enhancer.addMetaResource(dbResource, request.connection.info, options));
    } else {
      return reply(Boom.notFound(`${Model.modelName} with id ${request.params.id} does not exist`));
    }
  });
};

module.exports = {
  exec
};
