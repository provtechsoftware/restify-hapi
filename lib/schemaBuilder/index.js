"use strict";

const _ = require("lodash");
const Joi = require("joi");

const Dispatcher = require("./dispatcher");
const dispatcher = new Dispatcher();

/* ======== Helpers ======== */

const buildPaging = () => {
  return {
    offset: Joi.number().description("offset for paging"),
    limit: Joi.number().description("limit for paging")
  };
};

const buildAggr = () => {
  return {
    sort: Joi.string().description("sort the results by comma separated fields (prefix with - and + for order)"),
    project: Joi.string().description("select a subset of attributes (comma separated)"),
    raw: Joi.bool().description("show only the raw data")
  };
};

const buildQuery = (Model, options) => {
  const queryObject = {};

  const filtered = (schema, name) => {
    let filterOut = false;

    if (_.includes(["Mixed", "Buffer"], schema.instance)) {
      filterOut = true;
    }

    if (options) {
      if (options.skipInternals === true) {
        if (name.indexOf("_") === 0 && !name.indexOf("_id") === 0) {
          filterOut = true;
        }
      } else if (options.skipId === true) {
        if (name.indexOf("_id") === 0) {
          filterOut = true;
        }
      }
    }

    if (name.indexOf("__") === 0) {
      filterOut = true;
    }

    return filterOut;
  };

  _.each(Model.schema.paths, (schema, name) => {
    const key = `${name}Query`;

    if (filtered(schema, name) !== true) {
      queryObject[key] = Joi.string().description(`this resources ${name} field`);
    }
  });

  return queryObject;
};

const buildParamId = () => {
  return {
    id: Joi.number().required().description("this resources id")
  };
};

const buildModelPayload = (Model, options) => {
  const payloadObject = {};

  const filtered = (schema, name) => {
    let filterOut = false;

    if (options) {
      if (options.skipInternals === true) {
        if (name.indexOf("_") === 0 && !name.indexOf("_id") === 0) {
          filterOut = true;
        }
      }

      if (options.skipId === true) {
        if (name.indexOf("_id") === 0) {
          filterOut = true;
        }
      }
    }

    if (name.indexOf("__") === 0) {
      filterOut = true;
    }

    return filterOut;
  };

  _.each(Model.schema.paths, (schema, name) => {

    if (filtered(schema, name) !== true) {
      if (name === "_id") {
        name = "id";
      }
      const key = name;
      payloadObject[key] = dispatcher.dispatch(schema, options).schema;
    }
  });

  return payloadObject;
};


/* ======== Endpoints ======== */

const findAll = (Model, options) => {
  return {
    query: Joi.object(_.assign({}, buildPaging(), buildAggr(), buildQuery(Model, options)))
  };
};

const findOne = () => {
  return {
    params: Joi.object(_.assign({}, buildParamId())),
    query: Joi.object(_.assign({}, buildAggr()))
  };
};

const create = (Model, options) => {
  return {
    payload: Joi.object(_.assign({}, buildModelPayload(Model, options)))
  };
};

const update = (Model, options) => {
  return {
    params: Joi.object(_.assign({}, buildParamId())),
    payload: Joi.object(_.assign({}, buildModelPayload(Model, options)))
  };
};

const bulkUpdate = (Model, options) => {
  return {
    payload: Joi.array().items(Joi.object(_.assign({}, buildModelPayload(Model, options))))
  };
};

const remove = () => {
  return {
    params: Joi.object(_.assign({}, buildParamId()))
  };
};

const bulkDelete = () => {
  return {
    payload: Joi.array().items(Joi.number().description("the resources id"))
  };
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
