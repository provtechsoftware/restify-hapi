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

const clearCollections = (callback) => {
  const models = _.chain(_.keys(connection.models)).filter((model) => {
    return (model !== "IdentityCounter");
  }).value();

  async.eachSeries(models, (model, next) => {
    const Model = mongoose.model(model);

    Model.resetCount((err) => {
      if (err) {
        return next(err);
      }

      Model.find({}).remove().exec(next);
    });
  }, callback);
};

module.exports = () => {
  afterEach(clearCollections);
};
