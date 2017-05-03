"use strict";

const async = require("async");
const Boom = require("boom");
const _ = require("lodash");

const Parser = require("../tools/parser");
const Enhancer = require("../tools/enhancer");

const exec = (Model, logger, request, reply, options) => {
  const result = Parser.parse(request.query, Model, options);
  const valid = result.valid;
  const params = result.params;
  const error = result.err;
  const populations = Enhancer.dispatchPopulates(Model, options);

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

    // we populated the reference resource before in order to be able to
    // handle the archive feature --> map to _id again if populate setting
    // is set to false
    if (options.populate === false) {
      dbResources = _.map(dbResources, (dbResource) => {
        _.each((populations.path || populations).split(" "), (population) => {
          if (dbResource[population]) {
            if (_.isArray(dbResource[population])) {
              dbResource[population] = _.map(dbResource[population], "_id");
            } else {
              dbResource[population] = dbResource[population]._id;
            }
          }
        });

        return dbResource;
      });
    }

    return next(err, dbResources);
  };

  const execQuery = (next) => {
    Model.find(params.query, params.project, dbOptions)
      .sort(params.sort).populate(populations)
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
