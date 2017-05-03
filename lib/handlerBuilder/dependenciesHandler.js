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

  _.each(_.filter(options.hasMany, "destroy"), (hasManySetting) => {
    const fieldName = hasManySetting.fieldName;

    _.each(resources, (resource) => {
      if (resource[fieldName] && _.isArray(resource[fieldName])
        && Model.schema.paths[fieldName] && Model.schema.paths[fieldName].caster) {

        const referenceModel = Model.schema.paths[fieldName].caster.options.ref;
        const key = `${referenceModel}/${fieldName}`;

        if (!modelLookup[key]) {
          modelLookup[key] = {
            ids: resource[fieldName] || [],
            modelName: referenceModel,
            archive: hasManySetting.archive
          };
        } else {
          modelLookup[key].ids = _.compact(_.uniq(_.concat(modelLookup[key].ids, resource[fieldName])));
        }
      }
    });
  });

  async.eachSeries(_.keys(modelLookup), (key, next) => {
    const options = modelLookup[key];
    const Model = mongoose.model(options.modelName);
    const query = {
      _id: {
        $in: options.ids
      }
    };

    if (options.archive.enabled) {
      let fields = {};
      fields[options.archive.attribute] = true;

      Model.update(query, { $set: fields }, { multi: true }).lean().exec(next);
    } else {
      Model.find(query).remove().exec(next);
    }
  }, callback);
};

module.exports = {
  handleDependencies,
  handleDestroyDependencies
};
