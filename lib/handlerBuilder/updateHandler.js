"use strict";

const async = require("async");
const Boom = require("boom");

const Security = require("../tools/security");
const Validator = require("../tools/validator");
const Enhancer = require("../tools/enhancer");
const DependenciesHandler = require("./dependenciesHandler");

const execUpdate = (Model, logger, params, payload, options, callback) => {
  const dbOptions = {
    new: true
  };

  const doUpdate = () => {
    DependenciesHandler.handleDependencies(Model, payload, (err) => {
      if (err) {
        logger.warn(err);
        return callback(err, "badRequest");
      } else {
        Model.findByIdAndUpdate(params.id, payload, dbOptions).lean().exec((err, dbResource) => {
          if (err) {
            return callback(err.errmsg, "badImplementation");
          } else if (dbResource) {
            return callback(null, dbResource);
          } else {
            return callback(`${Model.modelName} with id ${params.id} not found`, "notFound");
          }
        });
      }
    });
  };

  if (payload.password) {

    if (options.password.validate === true) {
      const passwordError = Validator.validatePassword(payload.password, options);

      if (passwordError) {
        return callback(passwordError);
      }
    }

    if (options.password.encrypt === true) {
      Security.hashPassword(payload.password, (err, hash) => {
        if (err) {
          logger.error(err);
          return callback("Could not generate encrypted password", "badImplementation");
        }

        payload.password = hash;
        doUpdate();
      });
    } else {
      doUpdate();
    }

  } else {
    doUpdate();
  }
};

const exec = (Model, logger, request, reply, options) => {
  execUpdate(Model, logger, request.params, request.payload, options, (err, data) => {
    if (err) {
      logger.warn(err);
      if (!data) {
        data = "badImplementation";
      }
      return reply(Boom[data](err));
    } else {
      return reply(Enhancer.addMetaResource(data, request.connection.info, options));
    }
  });
};

const execBulk = (Model, logger, request, reply, options) => {
  let updatedResources = [];
  let boomType;

  const execUpdates = (next) => {
    async.eachSeries(request.payload, (payload, next) => {
      const params = { id: payload.id };

      execUpdate(Model, logger, params, payload, options, (err, data) => {
        if (err) {
          boomType = data || "badImplementation";
          return next(err);
        } else {
          updatedResources.push(data);
          return next();
        }
      });
    }, next);
  };

  const execCount = (next) => {
    Model.count().lean().exec(next);
  };

  async.parallel([
    execUpdates,
    execCount
  ], (err, data) => {
    if (err) {
      logger.warn(err);
      if (!boomType) {
        boomType = "badImplementation";
      }
      return reply(Boom[boomType](err));
    } else {
      const query = {
        "total": data[1]
      };
      return reply(Enhancer.addMetaCollection(updatedResources, query, request.connection.info, options));
    }
  });
};

module.exports = {
  exec,
  execBulk
};
