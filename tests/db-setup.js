"use strict";

const async = require("async");
const _ = require("lodash");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
let connection = mongoose.connection;

mongoose.Promise = require("bluebird");

before((done) => {
  mongoose.connect("mongodb://localhost:27017/restifyTest?auto_reconnect=true");
  connection.once("open", () => {
    autoIncrement.initialize(connection);
    done();
  });
});

after((done) => {
  connection.db.dropDatabase((err) => {
    if (err) {
      return done(err);
    }
    connection.close(done);
  });
});

const dropCollection = (modelName, callback) => {
  if (!modelName || !modelName.length) {
    return callback(new Error("You must provide the name of a model"));
  }

  const model = mongoose.model(modelName);

  model.remove({}, () => {
    if (modelName !== "IdentityCounter") {
      delete model.base.modelSchemas[modelName];
      delete connection.models[modelName];
      delete connection.collections[model.collection.collectionName];
    }
    return callback();
  });
};

module.exports = () => {
  afterEach(function(done) {
    const models = _.keys(connection.models).reverse();
    async.eachSeries(models, dropCollection, done);
  });
};
