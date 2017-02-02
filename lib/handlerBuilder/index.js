"use strict";

const FindAllHandler = require("./findAllHandler");
const FindOneHandler = require("./findOneHandler");
const CreateHandler = require("./createHandler");
const UpdateHandler = require("./updateHandler");
const DeleteHandler = require("./deleteHandler");

const findAll = (Model, logger, request, reply) => {
  return FindAllHandler.exec(Model, logger, request, reply);
};

const findOne = (Model, logger, request, reply) => {
  return FindOneHandler.exec(Model, logger, request, reply);
};

const create = (Model, logger, request, reply) => {
  return CreateHandler.exec(Model, logger, request, reply);
};

const update = (Model, logger, request, reply) => {
  return UpdateHandler.exec(Model, logger, request, reply);
};

const bulkUpdate = (Model, logger, request, reply) => {
  return UpdateHandler.execBulk(Model, logger, request, reply);
};

const remove = (Model, logger, request, reply) => {
  return DeleteHandler.exec(Model, logger, request, reply);
};

const bulkDelete = (Model, logger, request, reply) => {
  return DeleteHandler.execBulk(Model, logger, request, reply);
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
