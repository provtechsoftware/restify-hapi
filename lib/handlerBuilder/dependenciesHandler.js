"use strict";

const async = require("async");
const mongoose = require("mongoose");
const _ = require("lodash");

const buildReferences = (Model, options) => {
  let config = options[Model.modelName];
  config._references = {
    hasMany: [],
    belongsTo: []
  };

  _.each(Model.schema.paths, (path) => {
    if (path.caster && path.caster.options.ref) { // handle the hasMany relationship
      const referenceModel = path.caster.options.ref;
      const ReferenceModel = mongoose.model(referenceModel);

      // first we try to find the archive settings in the origin model's hasMany settings
      if (config.hasMany && _.find(config.hasMany, "fieldName", path.path)) {
        const hasManySetting = _.find(config.hasMany, "fieldName", path.path);

        // verify that RefenceModel has the defined archive attribute field on mongoose schema
        if (!ReferenceModel.schema.paths[hasManySetting.archive.attribute]) {
          throw new Error("archive field=" + hasManySetting.archive.attribute + " is not defined on model=" + ReferenceModel.modelName);
        }

        config._references.hasMany.push({
          referenceModel: referenceModel,
          fieldName: path.path,
          destroy: hasManySetting.destroy,
          archive: hasManySetting.archive
        });
      } else if (options[path.caster.options.ref]) { // try to find the archive settings on the reference model itself
        config._references.hasMany.push({
          referenceModel: referenceModel,
          fieldName: path.path,
          destroy: options[path.caster.options.ref].destroy,
          archive: options[path.caster.options.ref].archive
        });
      } else {
        throw new Error(`mongoose model for resource=${path.caster.options.ref} was not found`);
      }
    } else if (path.options.ref) { // handle the belongsTo relationship
      const referenceModel = path.options.ref;
      const ReferenceModel = mongoose.model(referenceModel);

      if (options[path.options.ref]) {

        // verify that RefenceModel has the defined archive attribute field on mongoose schema
        if (options[path.options.ref].archive && !ReferenceModel.schema.paths[options[path.options.ref].archive.attribute]) {
          throw new Error("archive field=" + options[path.options.ref].archive.attribute + " is not defined on model=" + ReferenceModel.modelName);
        }

        config._references.belongsTo.push({
          referenceModel: referenceModel,
          fieldName: path.path,
          destroy: options[path.options.ref].destroy,
          archive: options[path.options.ref].archive
        });
      } else {
        throw new Error(`mongoose model for resource=${path.options.ref} was not found`);
      }
    }
  });

  return;
};

const handleDependencies = (resource, options, callback) => {

  // belongsTo relationship
  // make sure the referenced resource exists
  const handleBelongsToRelationship = (next) => {
    async.eachSeries(options.references.belongsTo, (belongsToSetting, next) => {
      const ReferenceModel = mongoose.model(belongsToSetting.referenceModel);
      if(resource[belongsToSetting.fieldName]){
        ReferenceModel.findById(resource[belongsToSetting.fieldName], (err, referenceResource) => {
          if (err) {
            next(err);
          } else if (!referenceResource) {
            next(`${ReferenceModel.modelName} with id=${resource[belongsToSetting.fieldName]} was not found`);
          } else {
            next();
          }
        });
      }
      else{
        next();
      }
    }, next);
  };

  // hasMany relationship
  // make sure the referenced resources exist
  const handleHasManyRelationship = (next) => {

    // only check for the hasMany fields for which the resource acutally has some ids
    const hasManySettings = _.filter(options.references.hasMany, (setting) => {
      return resource[setting.fieldName].length;
    });

    async.eachSeries(hasManySettings, (hasManySetting, next) => {
      const ReferenceModel = mongoose.model(hasManySetting.referenceModel);
      const referencedIds = resource[hasManySetting.fieldName];

      const query = {
        _id: {
          $in: referencedIds
        }
      };

      const project = {
        _id: true
      };

      ReferenceModel.find(query, project).lean().exec((err, referenceResourceIds) => {
        if (err) {
          next(err);
        } else {
          referenceResourceIds = _.map(referenceResourceIds, "_id");
          const difference = _.difference(referencedIds, referenceResourceIds);

          if (difference.length) {
            next(`${ReferenceModel.modelName}s with ids=${difference} not found`);
          } else {
            next();
          }
        }
      });
    }, next);
  };

  async.parallel([
    handleBelongsToRelationship,
    handleHasManyRelationship
  ], callback);
};

// if a hasMany relationship has the destroy flag set to true for certain attributes
// then we remove the according reference models before removing the model itself.
const handleDestroyDependencies = (resources, options, callback) => {

  async.eachSeries(_.filter(options.references.hasMany, "destroy"), (hasManySetting, next) => {
    const ReferenceModel = mongoose.model(hasManySetting.referenceModel);
    const query = {
      _id: {
        $in: _.flatMap(resources, `${hasManySetting.fieldName}`)
      }
    };

    if (hasManySetting.archive.enabled) {
      let fields = {};
      fields[hasManySetting.archive.attribute] = true;

      ReferenceModel.update(query, { $set: fields }, { multi: true }).lean().exec(next);
    } else {
      ReferenceModel.find(query).remove().exec(next);
    }
  }, callback);

};

const generatePopulationSettings = (options) => {
  // query contains all the different archive attribute field names (default is _archvied)
  let orQueryPart = {};
  let orQuery = { $or: [] };
  let query = { $and: [] };
  let result = { path: "" };

  // first handle the belongsTo relationships
  let populations = _.map(options.references.belongsTo, (belongsToSetting) => {
    if (belongsToSetting.archive.enabled === true) {
      orQueryPart[belongsToSetting.archive.attribute] = { $exists: false };
      orQuery.$or.push(orQueryPart);
      orQueryPart[belongsToSetting.archive.attribute] = false;
      orQuery.$or.push(orQueryPart);
      query.$and.push(orQuery);
    }

    return belongsToSetting.fieldName;
  });

  // handle the hasMany relationships
  populations = _.concat(populations, _.map(options.references.hasMany, (hasManySetting) => {
    if (hasManySetting.archive.enabled === true) {
      orQueryPart[hasManySetting.archive.attribute] = { $exists: false };
      orQuery.$or.push(orQueryPart);
      orQueryPart[hasManySetting.archive.attribute] = false;
      orQuery.$or.push(orQueryPart);
      query.$and.push(orQuery);
    }

    return hasManySetting.fieldName;
  }));

  result.path = populations.join(" ");

  if (query.$and.length) {
    result.query = query;
  }

  if (options.populate === false) {
    result.select = "_id";
  }

  if(options.virtuals){
    if(options.virtuals.length > 0){
      result= options.virtuals.join(" ");
    }
  }

  return result;
};

module.exports = {
  buildReferences,
  handleDependencies,
  handleDestroyDependencies,
  generatePopulationSettings
};
