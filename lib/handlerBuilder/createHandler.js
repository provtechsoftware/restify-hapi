"use strict";

const Boom = require("boom");

const Security = require("../tools/security");
const Validator = require("../tools/validator");
const DependenciesHandler = require("./dependenciesHandler");

const exec = (Model, logger, request, reply, options) => {

  const save = () => {
    const resource = new Model(request.payload);

    resource.save((err, dbResource) => {
      if (err) {
        logger.error(err);
        return reply(Boom.badRequest(err.errmsg));
      } else {
        DependenciesHandler.handleDependencies(dbResource, options, (err) => {
          if (err) {
            logger.warn(err);
            dbResource.remove((rollbackErr) => {
              if (rollbackErr) {
                logger.error(rollbackErr);
              }
              return reply(Boom.badRequest(err));
            });
          } else {
            return reply(dbResource).code(201);
          }
        });
      }
    });
  };

  // If password validation is enabled and the payload has a password field, then check for
  // valid password property and encrypt if enabled
  if (request.payload.password) {

    if (options.password.validate === true) {
      const passwordError = Validator.validatePassword(request.payload.password, options);

      if (passwordError) {
        return reply(Boom.badRequest(passwordError));
      }
    }

    if (options.password.encrypt === true) {
      Security.hashPassword(request.payload.password, (err, hash) => {
        if (err) {
          logger.error(err);
          return reply(Boom.badImplementation("Could not generate encrypted password"));
        }

        request.payload.password = hash;
        save();
      });
    } else {
      save();
    }

  } else {
    save();
  }

};

module.exports = {
  exec
};
