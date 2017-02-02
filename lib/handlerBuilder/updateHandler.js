"use strict";

const exec = (Model, logger, request, reply) => {
  logger.info("Calling update route");
  return reply(null, { entry: "test" });
};

const execBulk = (Model, logger, request, reply) => {
  logger.info("Calling bulkUpdate route");
  return reply(null, { entry: "test" });
};

module.exports = {
  exec,
  execBulk
};
