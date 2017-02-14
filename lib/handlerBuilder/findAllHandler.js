"use strict";

const async = require("async");
const _ = require("lodash");
const Boom = require("boom");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options) => {
  let params = Parser.parse(request.query, Model);
  const dbOptions = {
    skip: params.offset,
    limit: params.limit
  };

  const responseHandler = (err, dbResources, next) => {
    if (err) {
      logger.error(err);
    }
    return next(err, dbResources);
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

  const execQuery = (next) => {
    if (options.populate !== false) {
      Model.find(params.query, params.project, dbOptions).sort(params.sort).populate(dispatchPopulates(options.populate)).lean().exec((err, dbResources) => responseHandler(err, dbResources, next));
    } else {
      Model.find(params.query, params.project, dbOptions).sort(params.sort).lean().exec((err, dbResources) => responseHandler(err, dbResources, next));
    }
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
