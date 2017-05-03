# Restify-Hapi - Fast and simple RESTful API builder for Hapi

A RESTful API generator plugin for the [hapi](https://hapijs.com/) framework utilizing the [mongoose](mongoosejs.com) ODM, [hapi-swagger](https://github.com/glennjones/hapi-swagger) and [joi](https://github.com/hapijs/joi).

[![NPM](https://nodei.co/npm/restify-hapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/restify-hapi/)

[![Build status](https://travis-ci.org/zebbra/restify-hapi.svg?branch=master)](https://travis-ci.org/zebbra/restify-hapi)
[![Dependencies Status](https://david-dm.org/zebbra/hapi-restify/status.svg)](https://david-dm.org/zebbra/restify-hapi)
[![Known Vulnerabilities](https://snyk.io/test/github/zebbra/restify-hapi/badge.svg)](https://snyk.io/test/github/zebbra/restify-hapi)

## Super simple and yet very powerful
restify-hapi is designed to be the simplest and fasted way possible to make RESTful APIs out of a mongoose schema definition. It is a hapi plugin intended to abstract the work involved in setting up API routes/validation/handlers/documentation/etc. for the purpose of fast app development without boilerplate code.

Define your (mongoose) schema for your resource only once and reuse it (for joi). This enforces a strict and explicit API definition which, together with hapi-swagger, evaluates in a very detailed API documentation.

![Overview](https://docs.google.com/drawings/d/1FolgXALLjPFrCQuVWc2q1Cr6MRjXdLhd7gypZVZLncU/pub?w=960&h=720)

## Example
```javascript
  // make sure to register all schemas before applying the restifier!
  const User = require("./fixtures/User");
  const Company = require("./fixtures/Company");

  const userOptions = {};
  const userRoutes = Restify.restify(User, userOptions, Logger);
  server.route(userRoutes);

  const companyOptions = {
    single: "company",
    multi: "companies",
    hasMany: [
     {
        fieldName: "employees",
        destroy: true,
        archive: {
          enabled: true
        }
    ]
  };
  const companyRoutes = Restify.restify(Company, companyOptions, Logger);
  server.route(companyRoutes);
```

## Table of contents
- [Installation](#options)
- [Configuration Options](#configuration-options)
- [Default Routes](#default-routes)
- [Query Pipeline](#query-pipeline)
- [Aggregation Pipeline](#aggregation-pipeline)
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
  "archive": false
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

## Default Routes
- __[GET] /resources__ list all resources ([Query-Pipeline](#{query-pipeline) and [Aggregation Pipeline](#aggregation-pipeline) are available and paging is activated)
- __[GET] /resources/{id}__ list resource details ([Aggregation Pipeline](#aggregation-pipeline) is available)
- __[POST] /resocurces__ create a new resource
- __[PUT] /resources/{id}__ update a resource
- __[PUT] /resources__ bulk update resources
- __[DELETE] /resources/{id}__ delete a resource
- __[DELETE] /resources__ bulk delete resources

[Back to top](#table-of-contents)

## Query Pipeline
`restify-hapi` provides query-paremeters out-of-the-box for almost every mongoose data type. You can query as following:
- `single value` e.g. ?name=John
- `array value` e.g. ?name=["John", "Doe"]
- `valid mongodb query` e.g. {"name": {"$eq": "John"}}

The query pipeline is not available for all routes. Please refere to [Default Routes](#default-routes) for more information.

[Back to top](#table-of-contents)

## Aggregation Pipeline
`restify-hapi` also provides an interface to select only certain fields and to sort by fields
- `sort` comma separated values (prefix with `-` for dsc sort). E.g. _sort=-_archived,name_
- `project` select only a subset of fields. Works the same way as sort

[Back to top](#table-of-contents)

## Tools
Paging, query pipeline, and aggregation pipeline make use of the modules stored in the [tools](./lib/tools) folder. You can use these tools also for resources which are not restified and which are manually added to the hapi-srever. These ensures that you paging, querying and all aggregations work the same way for those resources aswell. Please refere to the code for doc.

[Back to top](#table-of-contents)