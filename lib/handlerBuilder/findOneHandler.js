"use strict";

const exec = (Model, logger, request, reply) => {
  logger.info("Calling findOne route");
  return reply(null, { entry: "test" });
};

module.exports = {
  exec
};
