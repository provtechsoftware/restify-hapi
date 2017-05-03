"use strict";

const Boom = require("boom");

const DependenciesHandler = require("./dependenciesHandler");

const exec = (Model, logger, request, reply, options) => {
  const query = {
    "_id": request.params.id
  };

  const errorHandler = (err) => {
    logger.error(err);
    return reply(Boom.badImplementation("An internal mongodb error occured"));
  };

  Model.find(query).exec((err, dbResources) => {
    if (err) {
      return errorHandler(err);
    } else if (dbResources.length == 0) {
      return reply(Boom.notFound(`${Model.modelName} with id ${request.params.id} was not found and could not be deleted`));
    } else {
      DependenciesHandler.handleDestroyDependencies(Model, dbResources, options, (err) => {
        if (err) {
          return errorHandler(err);
        } else {
          if (options.archive && options.archive.enabled === true) {
            let fields = {};
            fields[options.archive.attribute] = true;

            Model.update(query, fields).lean().exec((err) => {
              if (err) {
                return errorHandler(err);
              } else {
                return reply().redirect(options.prefix).code(401);
              }
            });
          } else {
            Model.remove(query).lean().exec((err) => {
              if (err) {
                return errorHandler(err);
              } else {
                return reply().redirect(options.prefix).code(401);
              }
            });
          }
        }
      });
    }
  });

};

const execBulk = (Model, logger, request, reply, options) => {
  const query = {
    "_id": { $in: request.payload },
    "$or": [
      { "admin": { "$exists": false }},
      { "admin": false }
    ]
  };

  const errorHandler = (err) => {
    logger.error(err);
    return reply(Boom.badImplementation("An internal mongodb error occured"));
  };

  Model.find(query).exec((err, dbResources) => {
    if (err) {
      return errorHandler(err);
    } else {
      DependenciesHandler.handleDestroyDependencies(Model, dbResources, options, (err) => {
        if (err) {
          return errorHandler(err);
        } else {
          if (options.archive && options.archive.enabled === true) {
            let fields = {};
            fields[options.archive.attribute] = true;

            Model.update(query, fields).lean().exec((err, info) => {
              if (err) {
                return errorHandler(err);
              } else {
                return reply(info);
              }
            });
          } else {
            Model.remove(query).lean().exec((err, info) => {
              if (err) {
                return errorHandler(err);
              } else {
                return reply(info);
              }
            });
          }
        }
      });
    }
  });

};

module.exports = {
  exec,
  execBulk
};
