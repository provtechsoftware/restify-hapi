"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const dispatchPopulates = (Model, options) => {
  let query = {};

  const populations = _.chain(Model.schema.paths).filter((entry) => {
    if (entry.caster !== undefined) {
      if (entry.caster.options.ref) {
        const hasManySetting = _.find(options.hasMany, "fieldName", entry.path);

        if (hasManySetting && hasManySetting.archive && hasManySetting.archive.enabled === false) {
          query[hasManySetting.archive.attribute] = true;
        } else {
          const ReferenceModel = mongoose.model(entry.caster.options.ref);
          if (ReferenceModel._archived) {
            query._archived = false;
          }
        }
      }

      return (entry.caster.options.ref !== undefined);
    } else {
      return (entry.options.ref !== undefined);
    }
  }).map((entry) => {
    return entry.path;
  }).value();

  let result = {
    path: populations.join(" ")
  };

  if (_.keys(query).length > 0) {
    result.match = query;
  }

  return result;
};

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
  dispatchPopulates,
  addMetaResource,
  addMetaCollection
};
