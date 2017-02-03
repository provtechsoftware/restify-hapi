"use strict";

const async = require("async");
const Boom = require("boom");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options) => {
  let params = Parser.parse(request.query, Model);
  const dbOptions = {
    skip: params.offset,
    limit: params.limit
  };

  const execQuery = (next) => {
    Model.find(params.query, params.project, dbOptions).sort(params.sort).lean().exec((err, dbResources) => {
      if (err) {
        logger.error(err);
      }
      return next(err, dbResources);
    });
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
      return reply(Enhancer.addMetaCollection(results[0], params, request.connection.info, options));
    }
  });

};

module.exports = {
  exec
};
