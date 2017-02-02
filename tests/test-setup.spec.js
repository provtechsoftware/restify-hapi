"use strict";

const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

const Dispatcher = require("../lib/schemaBuilder/dispatcher");
const dbSetup = require("./db-setup");

before(function () {
  dbSetup();
  chai.use(sinonChai);
});

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
  this.User = require("./fixtures/User");
  this.Company = require("./fixtures/Company");
  this.dispatcher = new Dispatcher();
});

afterEach(function () {
  this.sandbox.restore();
});
