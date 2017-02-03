"use strict";

const _ = require("lodash");

const addMetaResource = (resource, info, options) => {
  let meta = {
    "_links": {
      "self": {
        "href": `${info.uri}${options.prefix}/${options.multi}/${resource._id}`
      }
    }
  };

  return _.assign(resource, meta);
};

const addMetaCollection = (resources, params, info, options) => {
  const baseUrl = `${info.uri}${options.prefix}/${options.multi}`;
  let urlParams = "";

  if (params.query) {
    _.each(params.query, (value, key) => {
      urlParams += `&${key}Query=${value}`;
    });
  }

  if (params.sort) {
    let sort = "&sort=";
    let sortings = [];

    _.each(params.sort, (value, key) => {
      let sign = "";
      if (value === -1) {
        sign = "-";
      }
      sortings.push(`${sign}${key}`);
    });

    sort += sortings.join(",");
    if (sortings.length > 0) {
      urlParams += sort;
    }
  }

  if (params.project) {
    let project = "&project=";
    let projects = [];

    _.each(params.project, (value, key) => {
      let sign = "";
      if (value === false) {
        sign = "-";
      }
      projects.push(`${sign}${key}`);
    });

    project += projects.join(",");
    if (projects.length > 0) {
      urlParams += project;
    }
  }

  const firstOffset = 0;

  let prevOffset = firstOffset;
  if (params.offset >= params.limit && params.offset > 0) {
    prevOffset = params.offset - params.limit;
  }

  let nextOffset = params.offset;
  if ((params.offset + params.limit) < params.total) {
    nextOffset = params.offset + params.limit;
  }

  let lastOffset = firstOffset;
  if (params.total >= params.limit) {
    lastOffset = params.total - params.limit;
  }

  let count = resources.length;
  if (params.offset < params.total) {
    count += params.offset;
  }

  let meta = {
    "_links": {
      "first": {
        "href": `${baseUrl}?offset=${firstOffset}&limit=${params.limit}${urlParams}`
      },
      "prev": {
        "href": `${baseUrl}?offset=${prevOffset}&limit=${params.limit}${urlParams}`
      },
      "self": {
        "href": `${baseUrl}?offset=${params.offset}&limit=${params.limit}${urlParams}`
      },
      "next": {
        "href": `${baseUrl}?offset=${nextOffset}&limit=${params.limit}${urlParams}`
      },
      "last": {
        "href": `${baseUrl}?offset=${lastOffset}&limit=${params.limit}${urlParams}`
      }
    },
    "_total": params.total,
    "_count": count
  };

  _.each(resources, (resource) => {
    addMetaResource(resource, info, options);
  });

  return _.assign(meta, { records: resources });
};

module.exports = {
  addMetaResource,
  addMetaCollection
};
