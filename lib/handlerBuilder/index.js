"use strict";

const FindAllHandler = require("./findAllHandler");

const findAll = (Model, logger, request, response) => {
  logger.info("findAll");
};

const findOne = (Model, logger, request, response) => {
  logger.info("findOne");
};

const create = (Model, logger, request, response) => {
  logger.info("create");
};

const update = (Model, logger, request, response) => {
  logger.info("update");
};

const bulkUpdate = (Model, logger, request, response) => {
  logger.info("bulkUpdate");
};

const remove = (Model, logger, request, response) => {
  logger.info("delete");
};

const bulkDelete = (Model, logger, request, response) => {
  logger.info("bulkDelete");
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  bulkUpdate,
  remove,
  bulkDelete
};
