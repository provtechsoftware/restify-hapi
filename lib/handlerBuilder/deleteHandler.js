"use strict";

const exec = (Model, logger, request, reply) => {
  logger.info("Calling delete route");
  return reply(null, { entry: "test" });
};

const execBulk = (Model, logger, request, reply) => {
  logger.info("Calling bulkDelete route");
  return reply(null, { entry: "test" });
};

module.exports = {
  exec,
  execBulk
};
