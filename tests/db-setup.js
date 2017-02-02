"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const connection = mongoose.connection;

mongoose.connect("mongodb://localhost:27017/restify?auto_reconnect=true");
mongoose.Promise = require("bluebird");

before((done) => {
  connection.once("open", () => {
    connection.db.dropDatabase(done);
    autoIncrement.initialize(connection);
  });
});

after((done) => {
  connection.close(done);
});

module.exports = () => {
  afterEach((done) => {
    connection.db.dropDatabase(done);
  });
};
