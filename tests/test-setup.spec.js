"use strict";

const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

const mongoose = require("mongoose");

const Dispatcher = require("../lib/schemaBuilder/dispatcher");
const ResourceHelper = require("./helpers/resourceHelper");
const dbSetup = require("./db-setup");
const Server = require("./server");

before(function (done) {
  dbSetup();
  chai.use(sinonChai);

  this.User = require("./fixtures/User");
  this.Company = require("./fixtures/Company");

  this.dispatcher = new Dispatcher();
  this.generatePayload = ResourceHelper.generatePayload;
  this.generateResource = ResourceHelper.generateResource;
  this.seedDatabase = ResourceHelper.seedDatabase;

  Server.start((server) => {
    this.server = server;
    done();
  });
});

beforeEach(function () {
  mongoose.model("User", require("./fixtures/User").schema);
  mongoose.model("Company", require("./fixtures/Company").schema);
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});
