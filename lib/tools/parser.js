"use strict";

const _ = require("lodash");

const parse = (query, model) => {
  let err = null;
  let valid = true;
  let modelAttributes = _.keys(model.schema.paths);
  let requestQuery = {
    offset: 0,
    limit: 1000,
    sort: {},
    project: {},
    query: {}
  };

  const dispatchOffset = () => {
    if (!isNaN(query.offset)) {
      let offset = parseInt(query.offset);
      if (offset < 0) {
        offset = 0;
      }
      requestQuery.offset = offset;
    }

    return;
  };

  const dispatchLimit = () => {
    if (!isNaN(query.limit)) {
      let limit = parseInt(query.limit);
      if (limit < 1) {
        limit = 1;
      }
      requestQuery.limit = limit;
    }

    return;
  };

  const dispatchProject = () => {
    let fields = _.chain(query.project.split(",")).map((field) => {
      let select = true;

      field = field.trim();

      if (field.charAt(0) === "-") {
        select = false;
        field = field.substring(1);
      }

      if (_.includes(modelAttributes, field)) {
        return [field, select];
      } else {
        return null;
      }
    }).compact().uniq().fromPairs().value();

    requestQuery.project = fields;

    return;
  };

  const dispatchSort = () => {
    let sortFields = _.chain(query.sort.split(",")).map((field) => {
      let order = 1;

      field = field.trim();

      if (field.charAt(0) === "-") {
        order = -1;
        field = field.substring(1);
      }

      if (_.includes(modelAttributes, field)) {
        return [field, order];
      } else {
        return null;
      }
    }).compact().uniq().fromPairs().value();

    requestQuery.sort = sortFields;

    return;
  };

  const dispatchQueryField = (key, value) => {
    key = key.replace("Query", "");
    if (_.includes(modelAttributes, key)) {
      if (/^\"?[{[]/.test(value)) {
        try {
          value = JSON.parse(value);
          if (_.isArray(value)) {
            value = { $in: value };
          }
        } catch (error) {
          err = error;
          valid = false;
        } finally {
          if (!err) {
            requestQuery.query[key] = value;
          }
        }
      } else {
        requestQuery.query[key] = value;
      }
    }
  };

  _.each(query, (value, key) => {
    switch (key) {
    case "offset":
      dispatchOffset();
      break;

    case "limit":
      dispatchLimit();
      break;

    case "project":
      dispatchProject();
      break;

    case "sort":
      dispatchSort();
      break;

    default:
      dispatchQueryField(key, value);
      return valid;
    }
  });

  return { valid: valid, params: requestQuery, err: err };
};

module.exports = {
  parse
};
