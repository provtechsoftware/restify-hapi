"use strict";

const Boom = require("boom");

const exec = (Model, logger, request, reply, options) => {
  Model.findByIdAndRemove(request.params.id).lean().exec((err, dbResource) => {
    if (err) {
      logger.error(err);
      return reply(Boom.badImplementation("An internal mongodb error occured"));
    } else if (dbResource) {
      return reply().redirect(options.prefix).code(401);
    } else {
      return reply(Boom.notFound(`${Model.modelName} with id ${request.params.id} was not found and could not be deleted`));
    }
  });
};

const execBulk = (Model, logger, request, reply) => {
  const query = {
    "_id": { $in: request.payload },
    "$or": [
      { "admin": { "$exists": false }},
      { "admin": false }
    ]
  };

  Model.find(query).remove().exec((err, info) => {
    if (err) {
      logger.error(err);
      return reply(Boom.badImplementation("An internal mongodb error occured"));
    } else {
      return reply(info);
    }
  });
};

module.exports = {
  exec,
  execBulk
};
