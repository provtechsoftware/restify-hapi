"use strict";

const Boom = require("boom");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options) => {
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
    .populate(Enhancer.dispatchPopulates(Model, options))
    .select(params.project)
    .lean().exec(responseHandler);
};

module.exports = {
  exec
};
