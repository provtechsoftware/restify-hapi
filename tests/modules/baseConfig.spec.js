"use strict";

const expect = require("chai").expect;

const BaseConfig = require("../../lib/baseConfig");

describe("The BaseConfig module", function() {

  it("builds the default config for User", function * () {
    const options = {};
    const config = yield BaseConfig.validateUserSettings(this.User, options);

    expect(config).to.have.property("auth").that.equals(false);
    expect(config).to.have.property("tags").that.deep.equals(["api"]);
    expect(config.routes).to.have.property("findAll").that.deep.equals({
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/users",
      "description": "Fetch all users",
      "notes": "Returns a list of all users",
      "populate": false
    });
    expect(config.routes).to.have.property("findOne").that.deep.equals({
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/users/{id}",
      "description": "Find this user",
      "notes": "Returns the user object belonging to this id",
      "populate": true
    });
    expect(config.routes).to.have.property("create").that.deep.equals({
      "enabled": true,
      "method": "POST",
      "path": "/api/v1/users",
      "description": "Create a new user",
      "notes": "Returns the newly created user object",
      "password": {
        "validate": true,
        "encrypt": true,
        "minlength": 8,
        "numbers": true,
        "uppercase": true,
        "special": true
      }
    });
    expect(config.routes).to.have.property("update").that.deep.equals({
      "enabled": true,
      "method": "PUT",
      "path": "/api/v1/users/{id}",
      "description": "Update this user",
      "notes": "Returns the updated user object",
      "password": {
        "validate": true,
        "encrypt": true,
        "minlength": 8,
        "numbers": true,
        "uppercase": true,
        "special": true
      }
    });
    expect(config.routes).to.have.property("bulkUpdate").that.deep.equals({
      "enabled": true,
      "method": "PUT",
      "path": "/api/v1/users",
      "description": "Update a set of users",
      "notes": "Returns the list of updated users",
      "password": {
        "validate": true,
        "encrypt": true,
        "minlength": 8,
        "numbers": true,
        "uppercase": true,
        "special": true
      }
    });
    expect(config.routes).to.have.property("delete").that.deep.equals({
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/users/{id}",
      "description": "Remove this user",
      "notes": "Returns http status of this action"
    });
    expect(config.routes).to.have.property("bulkDelete").that.deep.equals({
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/users",
      "description": "Remove a set of users",
      "notes": "Returns http status of this action"
    });
  });

  it("builds the default config for Company", function * () {
    const options = {
      multi: "companies"
    };
    const config = yield BaseConfig.validateUserSettings(this.Company, options);

    expect(config).to.have.property("auth").that.equals(false);
    expect(config).to.have.property("tags").that.deep.equals(["api"]);
    expect(config.routes).to.have.property("findAll").that.deep.equals({
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/companies",
      "description": "Fetch all companies",
      "notes": "Returns a list of all companies",
      "populate": false
    });
    expect(config.routes).to.have.property("findOne").that.deep.equals({
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/companies/{id}",
      "description": "Find this company",
      "notes": "Returns the company object belonging to this id",
      "populate": true
    });
    expect(config.routes).to.have.property("create").that.deep.equals({
      "enabled": true,
      "method": "POST",
      "path": "/api/v1/companies",
      "description": "Create a new company",
      "notes": "Returns the newly created company object",
      "password": {
        "validate": true,
        "encrypt": true,
        "minlength": 8,
        "numbers": true,
        "uppercase": true,
        "special": true
      }
    });
    expect(config.routes).to.have.property("update").that.deep.equals({
      "enabled": true,
      "method": "PUT",
      "path": "/api/v1/companies/{id}",
      "description": "Update this company",
      "notes": "Returns the updated company object",
      "password": {
        "validate": true,
        "encrypt": true,
        "minlength": 8,
        "numbers": true,
        "uppercase": true,
        "special": true
      }
    });
    expect(config.routes).to.have.property("bulkUpdate").that.deep.equals({
      "enabled": true,
      "method": "PUT",
      "path": "/api/v1/companies",
      "description": "Update a set of companies",
      "notes": "Returns the list of updated companies",
      "password": {
        "validate": true,
        "encrypt": true,
        "minlength": 8,
        "numbers": true,
        "uppercase": true,
        "special": true
      }
    });
    expect(config.routes).to.have.property("delete").that.deep.equals({
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/companies/{id}",
      "description": "Remove this company",
      "notes": "Returns http status of this action"
    });
    expect(config.routes).to.have.property("bulkDelete").that.deep.equals({
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/companies",
      "description": "Remove a set of companies",
      "notes": "Returns http status of this action"
    });
  });

  it("applies the user settings correctly", function * () {
    const options = {
      auth: {
        scope: ["admin"]
      },
      tags: ["api", "test"],
      prefix: "/api/v2",
      single: "employee",
      multi: "employees",
      routes: {
        findAll: {
          populate: true
        },
        create: {
          password: {
            special: false
          }
        },
        bulkUpdate: {
          enabled: false
        },
        bulkDelete: {
          enabled: false
        }
      }
    };
    const config = yield BaseConfig.validateUserSettings(this.User, options);

    expect(config).to.have.property("auth").that.deep.equals({ scope: ["admin"] });
    expect(config).to.have.property("tags").that.deep.equals(["api", "test"]);
    expect(config).to.have.property("prefix").that.equals("/api/v2");
    expect(config).to.have.property("single").that.equals("employee");
    expect(config).to.have.property("multi").that.equals("employees");
    expect(config.routes).to.have.property("findAll").that.has.property("path").that.equals("/api/v2/employees");
    expect(config.routes).to.have.property("create").that.has.property("password").that.has.property("special").that.equals(false);
    expect(config.routes).to.have.property("bulkUpdate").that.has.property("enabled").that.equals(false);
    expect(config.routes).to.have.property("bulkDelete").that.has.property("enabled").that.equals(false);
  });

});
