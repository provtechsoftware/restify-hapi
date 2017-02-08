"use strict";

const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

const Dispatcher = require("../lib/schemaBuilder/dispatcher");
const dbSetup = require("./db-setup");

const generateResource = (modelName, callback) => {
  const User = require("./fixtures/User");
  const Company = require("./fixtures/Company");
  let resource;

  const randomString = () => {
    Math.random().toString(36).substring(7);
  };

  switch (modelName) {
  case "User":
    resource = new User({
      name: randomString(),
      email: "te@te.ch",
      binary: randomString(),
      living: true,
      password: "$Password1",
      updated: new Date(),
      age: 18,
      mixed: ["mixed"],
      array: [1],
      arrayTwo: ["entry1", "entry2"],
      ofString: ["string"],
      ofNumber: [1],
      ofDates: [new Date()],
      ofBuffer: [randomString()],
      ofBoolean: [true, false],
      ofMixed: ["mixed1", "mixed2"],
      nexted: {
        stuff: "stuff",
        otherStuff: "otherStuff"
      }
    });
    break;

  case "Company":
    resource = new Company({
      name: randomString()
    });
    break;

  default:
    break;
  }

  return callback(null, resource);
};

before(function () {
  dbSetup();
  chai.use(sinonChai);
  this.User = require("./fixtures/User");
  this.Company = require("./fixtures/Company");
  this.dispatcher = new Dispatcher();
  this.generateResource = generateResource;
});

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});
