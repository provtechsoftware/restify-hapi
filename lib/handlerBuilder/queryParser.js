"use strict";

const parse = (query, model, logger) => {
  logger.info("parsing query");

  let requestQuery = {
    offset: 0,
    limit: 1000,
    sort: {},
    project: {},
    query: {}
  };

  return requestQuery;
};

module.exports = {
  parse
};
