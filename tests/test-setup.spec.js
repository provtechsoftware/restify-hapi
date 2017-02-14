"use strict";

const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

const dbSetup = require("./db-setup");
const Dispatcher = require("../lib/schemaBuilder/dispatcher");
const ResourceHelper = require("./helpers/resourceHelper");
const Server = require("./server");

before(function (done) {
  dbSetup();
  chai.use(sinonChai);

  this.dispatcher = new Dispatcher();
  this.ResourceHelper = ResourceHelper;

  this.User = require("./fixtures/User");
  this.Company = require("./fixtures/Company");

  Server.start((server) => {
    this.server = server;
    done();
  });
});

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});
