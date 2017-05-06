"use strict";

const async = require("async");

const randomString = () => {
  return Math.random().toString(36).substring(7);
};

const generatePayload = (modelName) => {
  let payload = {};

  switch (modelName) {
  case "User":
    payload = {
      name: randomString(),
      email: "te@te.ch",
      binary: randomString(),
      living: true,
      password: "$Password1",
      updated: new Date(),
      age: 18,
      mixed: ["test"],
      array: [1],
      arrayTwo: ["entry1", "entry2"],
      ofString: ["string"],
      ofNumber: [1, 2],
      ofDates: [new Date()],
      ofBuffer: [randomString()],
      ofBoolean: [true, false],
      ofMixed: ["mixed1", "mixed2"],
      "nested.stuff": "stuff",
      "nested.otherStuff": 10,
      company: 0,
      _archived: false
    };
    break;

  case "Company":
    payload = {
      name: randomString(),
      employees: [],
      _archived: false
    };
    break;

  default:
    break;
  }

  return payload;
};

const generateResource = (Model, callback) => {
  let resource;

  switch (Model.modelName) {
  case "User":
    resource = new Model(generatePayload("User"));
    return callback(null, resource);

  case "Company":
    resource = new Model(generatePayload("Company"));
    return callback(null, resource);

  default:
    return callback(null, resource);
  }

};

const seedDatabase = (Model, number, done) => {
  let count = 0;

  if (isNaN(number) && typeof number === "function") {
    done = number;
    number = 5;
  }

  async.whilst(
    () => { return (count < number); },
    (next) => {
      count++;
      generateResource(Model, (err, modelEntry) => {
        if (err) {
          return next(err);
        }

        modelEntry.save(next);
      });
    },
    done
  );
};

module.exports = {
  generatePayload,
  generateResource,
  seedDatabase
};
