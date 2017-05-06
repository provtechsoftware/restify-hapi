# Restify-Hapi - Fast and simple RESTful API builder for Hapi

A RESTful API generator plugin for the [hapi](https://hapijs.com/) framework utilizing the [mongoose](mongoosejs.com) ODM, [hapi-swagger](https://github.com/glennjones/hapi-swagger) and [joi](https://github.com/hapijs/joi).

[![NPM](https://nodei.co/npm/restify-hapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/restify-hapi/)

[![Build status](https://travis-ci.org/zebbra/restify-hapi.svg?branch=master)](https://travis-ci.org/zebbra/restify-hapi)
[![Dependencies Status](https://david-dm.org/zebbra/hapi-restify/status.svg)](https://david-dm.org/zebbra/restify-hapi)
[![Known Vulnerabilities](https://snyk.io/test/github/zebbra/restify-hapi/badge.svg)](https://snyk.io/test/github/zebbra/restify-hapi)

## Super simple and yet very powerful
restify-hapi is designed to be the simplest and fasted way possible to make RESTful APIs out of a mongoose schema definition. It is a hapi plugin intended to abstract the work involved in setting up API routes/validation/handlers/documentation/etc. for the purpose of fast app development without boilerplate code.

Define your (mongoose) schema for your resource only once and reuse it (for joi). This enforces a strict and explicit API definition which, together with hapi-swagger, evaluates in a very detailed API documentation.

## Table of contents
- [Installation](#options)
- [Example](#example)
- [Default Routes](#default-routes)
- [Supported Data Types](#supported-data-types)
- [Pagination](#pagination)
- [Query Pipeline](#query-pipeline)
- [Aggregation Pipeline](#aggregation-pipeline)
- [Configuration Options](#configuration-options)
- [Testing](#testing)
- [Swagger](#swagger)
- [Tools](#tools)

## Installation
This module was implemented and tested with:
- NPM version 3.10.8
- node version 4.x
- mongodb version 3.x
- mongoose version 4.x

I do not know how this module will behave with other configurations.

```bash
$ npm install restify-hapi
```

[Back to top](#table-of-contents)

## Example
This is the example we use in the [test hapi-server](./tests/server.js).
```javascript
  // first require all mongoose models because they might be referenced
  // in the restify method
  require("./fixtures/User");
  require("./fixtures/Company");

  const options = {
    User: {
      routes: {
        findAll: {
          populate: false
        }
      }
    },
    Company: {
      single: "company",
      multi: "companies",
      hasMany: [
        // employees (users) are destroyed when this company is destroyed
        // however in this case we apply the archive policy. This means
        // that we do not remove the resources but mark them as _archived=true
        {
          fieldName: "employees",
          destroy: true,
          archive: {
            enabled: true
          }
        }
      ]
    }
  };

  server.route(Restify.restify(options, Logger));
```

If you enable the archive feature then you have to make sure that your mongoose schemas specify the used archive attribute field (per default this is set to `_archived`)

[Back to top](#table-of-contents)

## Default Routes
| Method | Path | Information |
| --- | --- | --- |
| GET | /resources | list all resources ([Pagination](#pagination), [Query-Pipeline](#{query-pipeline) and [Aggregation Pipeline](#aggregation-pipeline) are available) |
| GET | /resources/{id} | list resource details ([Aggregation Pipeline](#aggregation-pipeline) is available) |
| POST | /resources | create a new resource |
| PUT | /resources/{id} | update a resource |
| PUT | /resources | bulk update multiple resources |
| DELETE | /resources/{id} | delete a resource |
| DELETE | /resources | bulk delete multipe resources |

[Back to top](#table-of-contents)

## Supported Data Types

The [User Schema](./tests/fixtures/User.js) summarizes all supported data-types and validations.

```javascript
const UserSchema = new Schema({
  name:       { type: String, match: /.*/ },
  email:      { type: String, minlength: 3, maxlength: 20, required: true, default: "example@user.com"},
  binary:     { type: Buffer, required: true, default: "default buffer" },
  living:     { type: Boolean, required: true, default: false },
  password:   { type: String, required: true, minlength: 8 },
  updated:    { type: Date, default: now, min: dummyDate, required: true },
  age:        { type: Number, min: 18, max: 65, required: true, default: 20 },
  mixed:      { type: Schema.Types.Mixed, required: true, default: "test", enum: ["test", "test1", "test2"] },
  array:      [],
  arrayTwo:   { type: Array, required: true, min: 2, max: 5 },
  ofString:   [String],
  ofNumber:   { type: Array, required: true, min: 2, default: [1, 2] },
  ofDates:    [Date],
  ofBuffer:   [Buffer],
  ofBoolean:  [Boolean],
  ofMixed:    { type: [Schema.Types.Mixed], min: 2},
  ofObjectId: [Schema.Types.ObjectId],
  nested: {
    stuff: { type: String, lowercase: true, trim: true },
    otherStuff: { type: Number, required: true }
  },
  company:    { type: Number, ref: "Company", required: true },
  _archived: { type: Boolean, required: true, default: false }
});

```

[Back to top](#table-of-contents)

## Pagination

Pagination works with the `limit` and `offset` parameters
- `limit` specify how many results to display
- `offset` specify at which position to start fetching the data in mongodb (skip)

Example:

_?limit=10&offset=5_ skipps the first 5 documents and fetches the next 10 in the mongodb collection

[Back to top](#table-of-contents)

## Query Pipeline
`restify-hapi` provides query-paremeters out-of-the-box for almost every mongoose data type. The model attributes are suffixed with `Query`. You can query as following:
- `single value` e.g. nameQuery=John
- `array value` e.g. nameQuery=["John", "Doe"]
- `valid mongodb query` e.g. nameQuery={"name": {"$eq": "John"}}

The query pipeline is not available for all routes. Please refere to [Default Routes](#default-routes) for more information.

[Back to top](#table-of-contents)

## Aggregation Pipeline
`restify-hapi` also provides an interface to select only certain fields and to sort by fields
- `sort` comma separated values (prefix with `-` for dsc sort). E.g. _sort_=-_archived,name_
- `project` select only a subset of fields. Works the same way as sort

[Back to top](#table-of-contents)

## Configuration Options
The default options (in this case for the sample `company` resource) are as follows. You can overwrite all attribute values as long as they are valid for a hapi-server and as long as they conform to the joi-schema specification of the config object defined in [baseConfig](./lib/baseConfig.js)).
```json
{
  "single": "company",
  "multi": "companies",
  "hasMany": [
    {
      "fieldName": "employees",
      "destroy": true,
      "archive": {
        "enabled": true,
        "attribute": "_archived"
      }
    }
  ],
  "model": "Company",
  "routes": {
    "findAll": {
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/companies",
      "description": "Fetch all companies",
      "notes": "Returns a list of all companies",
      "populate": false,
      "skipRequired": false,
      "skipInternals": true,
      "skipId": false
    },
    "findOne": {
      "enabled": true,
      "method": "GET",
      "path": "/api/v1/companies/{id}",
      "description": "Find this company",
      "notes": "Returns the company object belonging to this id",
      "populate": true,
      "skipRequired": false,
      "skipInternals": false,
      "skipId": false
    },
    "create": {
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
      },
      "skipRequired": false,
      "skipInternals": true,
      "skipId": true
    },
    "update": {
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
      },
      "skipRequired": true,
      "skipInternals": true,
      "skipId": true
    },
    "bulkUpdate": {
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
      },
      "skipRequired": true,
      "skipInternals": true,
      "skipId": false
    },
    "delete": {
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/companies/{id}",
      "description": "Remove this company",
      "notes": "Returns http status of this action",
      "skipRequired": false,
      "skipInternals": true,
      "skipId": false
    },
    "bulkDelete": {
      "enabled": true,
      "method": "DELETE",
      "path": "/api/v1/companies",
      "description": "Remove a set of companies",
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
  "populate": true,
  "destroy": true,
  "archive": {
    "enabled": true,
    "attribute": "_archived"
  }
}
```

- `single` how this resource's single name should be (per default derived from the mongoose schema name)
- `multi` how this resource's multi name should be (per default single name + s)
- `hasMany` specify the has-many relationship options (this is optional. You can specify references without specifying any options here. In this case the destroy is set to false)
  - `fieldName` the attribute name in the mongoose schema which references the reference model
  - `destroy` whether to remove the referenced resources if this resource is removed (default is false)
  - `archive` (only works if destroy is set to true)
    - `enabeld` whether mark the resource as `archived` or to remove it from the collection upon removal
    - `attribute` if archive policy is enabled the you can specify the attribute field name which should be used in the schema to mark this resource as archived (default is _archived). You have to make sure that the specified attribute field name exists on the schema, otherwise the library will throw an error
- `routes` RESTful CRUD operations for this resource
  - `enabled` whether to use this route or not (default set to true)
  - `password` settings for the _password_ attribute in the payload of this route
  - `skipXXX` you should not alter this settings
  - `auth` authentication settings on route-layer
- `auth` authentication settings on root-layer (will be applied for routes which have no auth settings specified). Must be a valid [hapi authentication](https://hapijs.com/tutorials/auth) setting
- `prefix` used as api prefix
- `populate` whether to populate reference resources or not
- `archive` global archive policy

[Back to top](#table-of-contents)

## Testing
Clone the package, install the dependencies, and then run:

```bash
$ npm test // runs the unit tests
$ npm run test-cover // module test-coverage report
$ npm run test-server // starts the test hapi-server located under ./tests/server.js
```

[Back to top](#table-of-contents)

## Swagger

You can use [hapi-swagger](https://github.com/glennjones/hapi-swagger) to document the auto-generated API. All restified resources will have a very detailed swagger api documentation.

![swagger](https://docs.google.com/drawings/d/1LZLRjFQ3Gzi0nDMiMwlRDwz5c2vHbNkkTHCcHAQsQBw/pub?w=960&h=720)

Exapmle configuration:
```javascript
  const swaggerOptions = {
    info: {
      "title": "API Documentation",
      "version": Pack.version
    },
    "basePath": "/api",
    "pathPrefixSize": 3
  };

  server.register([
    Inert,
    Vision,
    {
      "register": HapiSwagger,
      "options": swaggerOptions
    }
  ], next);
```

[Back to top](#table-of-contents)

## Tools
Pagination, query pipeline, and aggregation pipeline make use of the modules stored in the [tools](./lib/tools) folder. You can use these tools also for resources which are not restified and which are manually added to the hapi-srever. These ensures that you paging, querying and all aggregations work the same way for those resources aswell. Please refere to the code for doc.

| Module | Method | Description |
| --- | --- | --- |
| [Enhancer](./lib/tools/enhancer.js) | _addMetaCollection_ | adds the _links_ (first, prev, self, next, last), _total_, and _count_ information to a collection |
| [Enhancer](./lib/tools/enhancer.js) | _addMetaResource_ | adds the _links_ (self) information to a single resource |
| [Parser](./lib/tools/parser.js) | _parse_ | parses the _offset, limit, project, sort, and queries_ parameters |
| [Security](./lib/tools/security.js) | _hashPassword_ | hash the given password with bcrypt |
| [Security](./lib/tools/security.js) | _comparePasswords_ | compare a password with a hashedPassword for equality |
| [Validator](./lib/tools/validator.js) | _validatePassword_ | validates the given password against the specified options |
| [Validator](./lib/tools/validator.js) | _generateRandomPassword_ | generates a sample password |


[Back to top](#table-of-contents)