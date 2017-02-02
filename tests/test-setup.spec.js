"use strict";

const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

const Dispatcher = require("../lib/schemaBuilder/dispatcher");

before(function () {
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
