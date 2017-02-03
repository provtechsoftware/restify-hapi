"use strict";

const FindAllHandler = require("./findAllHandler");
const FindOneHandler = require("./findOneHandler");
const CreateHandler = require("./createHandler");
const UpdateHandler = require("./updateHandler");
const DeleteHandler = require("./deleteHandler");

const findAll = FindAllHandler.exec;
const findOne = FindOneHandler.exec;
const create = CreateHandler.exec;
const update = UpdateHandler.exec;
const bulkUpdate = UpdateHandler.execBulk;
const remove = DeleteHandler.exec;
const bulkDelete = DeleteHandler.execBulk;

module.exports = {
  findAll,
  findOne,
  create,
  update,
  bulkUpdate,
  remove,
  bulkDelete
};
