"use strict";

const async = require("async");
const mongoose = require("mongoose");
const _ = require("lodash");

const handleDependencies = (Model, resource, callback) => {
  async.eachSeries(Model.schema.paths, (path, next) => {

    // belongsTo relationship
    if (path.options.ref) {
      const ReferenceModel = mongoose.model(path.options.ref);

      ReferenceModel.findById(resource[path.path], (err, referenceResource) => {
        if (err) {
          next(err);
        } else if (!referenceResource) {
          next(`${ReferenceModel.modelName} with id=${resource[path.path]} was not found`);
        } else {
          next();
        }
      });
    }

    // hasMany relationship
    else if (path.caster) {
      const referenceModel = path.caster.options.ref;

      if (referenceModel) {
        const ReferenceModel = mongoose.model(referenceModel);

        async.eachSeries(resource[path.caster.path], (referenceId, next) => {
          ReferenceModel.findById(referenceId, (err, referenceResource) => {
            if (err) {
              next(err);
            } else if (!referenceResource) {
              next(`${ReferenceModel.modelName} with id=${referenceId} was not found`);
            } else {
              next();
            }
          });
        }, next);
      } else {
        next();
      }
    }

    else {
      next();
    }
  }, callback);
};

// if a hasMany relationship has the destroy flag set to true for certain attributes
// then we remove the according reference models before removing the model itself.
const handleDestroyDependencies = (Model, resources, options, callback) => {
  let modelLookup = {};

  _.each(_.filter(options.hasMany, "destroy"), (attribute) => {
    const fieldName = attribute.fieldName;

    _.each(resources, (resource) => {
      if (resource[fieldName] && _.isArray(resource[fieldName])
        && Model.schema.paths[fieldName] && Model.schema.paths[fieldName].caster) {

        const referenceModel = Model.schema.paths[fieldName].caster.options.ref;

        if (!modelLookup[referenceModel]) {
          modelLookup[referenceModel] = [];
        }

        modelLookup[referenceModel] = _.compact(_.uniq(_.concat(modelLookup[referenceModel], resource[fieldName])));
      }
    });
  });

  async.eachSeries(_.keys(modelLookup), (referenceModel, next) => {
    const Model = mongoose.model(referenceModel);
    const query = {
      _id: {
        $in: modelLookup[referenceModel]
      }
    };

    Model.find(query).remove().exec(next);
  }, callback);
};

module.exports = {
  handleDependencies,
  handleDestroyDependencies
};
