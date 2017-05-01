# Restify-Hapi - Simplified HTTP client

A RESTful API generator plugin for the [hapi](https://hapijs.com/) framework utilizing the [mongoose](mongoosejs.com) ODM, [hapi-swagger](https://github.com/glennjones/hapi-swagger) and [joi](https://github.com/hapijs/joi).

[![NPM](https://nodei.co/npm/restify-hapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/restify-hapi/)

[![Build status](https://travis-ci.org/mbaertschi/restify-hapi.svg?branch=master)](https://travis-ci.org/mbaertschi/restify-hapi)
[![Dependencies Status](https://david-dm.org/mbaertschi/hapi-restify/status.svg)](https://david-dm.org/mbaertschi/restify-hapi)
[![Known Vulnerabilities](https://snyk.io/test/github/mbaertschi/restify-hapi/badge.svg)](https://snyk.io/test/github/mbaertschi/restify-hapi)

## Super simple and yet very powerful
restify-hapi is designed to be the simplest and fasted way possible to make RESTful APIs out of a mongoose schema definition. It is a hapi plugin intended to abstract the work involved in setting up API routes/validation/handlers/documentation/etc. for the purpose of fast app development without boilerplate code.

Define your (mongoose) schema for your resource only once and reuse it (for joi). This enforces a strict and explicit API definition which, together with hapi-swagger, evaluates in a very detailed API documentation.

![Overview](https://docs.google.com/drawings/d/1FolgXALLjPFrCQuVWc2q1Cr6MRjXdLhd7gypZVZLncU/pub?w=960&h=720)

## Example
```javascript
  const User = require("./fixtures/User");
  const userOptions = {};
  const userRoutes = Restify.restify(User, userOptions, Logger);
  server.route(userRoutes);

  const Company = require("./fixtures/Company");
  const companyOptions = {
    single: "company",
    multi: "companies",
    hasMany: [
      {
        fieldName: "employees",
        destroy: true
      }
    ]
  };
  const companyRoutes = Restify.restify(Company, companyOptions, Logger);
  server.route(companyRoutes);
```

## Table of contents
- [Options](#options)
- [Query Pipeline](#query-pipeline)
- [Aggregation Pipeline](#aggregation-pipeline)
- [Tools](#tools)

## Options
The default options are as follows. You can overwrite all attribute values as long as they are valid for a hapi-server and as long as they conform to the joi-schema specification of the config object defined in [baseConfig](./lib/baseConfig.js)).
```json
{
  "routes": {
    "findAll": {
      "populate": false,
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/users",
      "description": "Fetch all users",
      "notes": "Returns a list of all users",
      "skipRequired": false,
      "skipInternals": true,
      "skipId": false
    },
    "findOne": {
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/users/{id}",
      "description": "Find this user",
      "notes": "Returns the user object belonging to this id",
      "populate": true,
      "skipRequired": false,
      "skipInternals": false,
      "skipId": false
    },
    "create": {
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
      },
      "skipRequired": false,
      "skipInternals": true,
      "skipId": true
    },
    "update": {
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
      },
      "skipRequired": true,
      "skipInternals": true,
      "skipId": true
    },
    "bulkUpdate": {
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
      },
      "skipRequired": true,
      "skipInternals": true,
      "skipId": false
    },
    "delete": {
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/users/{id}",
      "description": "Remove this user",
      "notes": "Returns http status of this action",
      "skipRequired": false,
      "skipInternals": true,
      "skipId": false
    },
    "bulkDelete": {
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/users",
      "description": "Remove a set of users",
      "notes": "Returns http status of this action",
      "skipRequired": false,
      "skipInternals": true,
      "skipId": false
    }
  },
  "auth": false,
  "tags": [
    "api"
  ],
  "prefix": "/api/v1",
  "single": "user",
  "multi": "users",
  "hasMany": false,
  "populate": true
}
```

- `routes/x/password` settings for the `password` attribute in the payload of this route
- `auth` must be a valid [hapi authentication](https://hapijs.com/tutorials/auth) setting (can be specified on root or on routes level)
- `prefix` used as api prefix
- `single` how this resource's single name should be (per default derived from the mongoose schema name)
- `multi` how this resource's multi name should be (per default single name + s)
- `hasMany` here you can define if this resource has a `has-many` relationship which should be destroyed when this resource is destroyed (see the [test-server](./tests/server.js) settings for example)
- `populate` whether to populate reference resources or not

[Back to top](#table-of-contents)

## Query Pipeline
TODO
[Back to top](#table-of-contents)

## Aggregation Pipeline
TODO
[Back to top](#table-of-contents)

## Tools
TODO
[Back to top](#table-of-contents)