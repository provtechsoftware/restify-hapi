"use strict";

const expect = require("chai").expect;

const Enhancer = require("./enhancer");

describe("The Enhancer module", function() {
  const info = {
    "uri": "http://localhost:4000"
  };

  const options = {
    "prefix": "/api/v1",
    "single": "company",
    "multi": "companies"
  };

  it("generates the self link for a single resource uri", function() {
    const options = {
      "prefix": "/api/v1",
      "single": "user",
      "multi": "users"
    };

    this.generateResource("User", (err, resource) => {
      expect(err).to.equal(null);

      const id = resource._id;
      const meta = Enhancer.addMetaResource(resource, info, options);

      expect(meta).to.have.property("_links").that.deep.equals({
        "self": {
          "href": `http://localhost:4000/api/v1/users/${id}`
        }
      });
    });
  });

  it("generates the default paging links for collections", function() {
    const params = {
      "offset": 0,
      "limit": 2,
      "total": 10
    };

    this.generateResource("Company", (err, resource) => {
      expect(err).to.equal(null);

      const baseUrl = `http://localhost:4000/api/v1/companies`;
      let resources = [];
      for(let i = 0; i < params.limit; i++) {
        resources.push(resource);
      }

      const meta = Enhancer.addMetaCollection(resources, params, info, options);
      expect(meta).to.have.property("_links").that.deep.equals({
        "first": {
          "href": `${baseUrl}?offset=0&limit=2`
        },
        "prev": {
          "href": `${baseUrl}?offset=0&limit=2`
        },
        "self": {
          "href": `${baseUrl}?offset=0&limit=2`
        },
        "next": {
          "href": `${baseUrl}?offset=2&limit=2`
        },
        "last": {
          "href": `${baseUrl}?offset=8&limit=2`
        },
      });
    });
  });

  it("generates the the correct edge paging links for collections", function() {
    const params = {
      "offset": 9,
      "limit": 2,
      "total": 10
    };

    this.generateResource("Company", (err, resource) => {
      expect(err).to.equal(null);

      const baseUrl = `http://localhost:4000/api/v1/companies`;
      let resources = [];
      for(let i = 0; i < params.limit; i++) {
        resources.push(resource);
      }

      const meta = Enhancer.addMetaCollection(resources, params, info, options);
      expect(meta).to.have.property("_links").that.deep.equals({
        "first": {
          "href": `${baseUrl}?offset=0&limit=2`
        },
        "prev": {
          "href": `${baseUrl}?offset=7&limit=2`
        },
        "self": {
          "href": `${baseUrl}?offset=9&limit=2`
        },
        "next": {
          "href": `${baseUrl}?offset=9&limit=2`
        },
        "last": {
          "href": `${baseUrl}?offset=8&limit=2`
        },
      });
    });
  });

  it("adds the query, sort, and project params to the paging links", function() {
    const params = {
      "offset": 0,
      "limit": 2,
      "total": 10,
      "query": {
        "name": "company"
      },
      "sort": {
        "name": -1
      },
      "project": {
        "name": true,
        "__v": false
      }
    };

    this.generateResource("Company", (err, resource) => {
      expect(err).to.equal(null);

      const baseUrl = `http://localhost:4000/api/v1/companies`;
      const urlParams = "&nameQuery=company&sort=-name&project=name,-__v";
      let resources = [];
      for(let i = 0; i < params.limit; i++) {
        resources.push(resource);
      }

      const meta = Enhancer.addMetaCollection(resources, params, info, options);
      expect(meta).to.have.property("_links").that.deep.equals({
        "first": {
          "href": `${baseUrl}?offset=0&limit=2${urlParams}`
        },
        "prev": {
          "href": `${baseUrl}?offset=0&limit=2${urlParams}`
        },
        "self": {
          "href": `${baseUrl}?offset=0&limit=2${urlParams}`
        },
        "next": {
          "href": `${baseUrl}?offset=2&limit=2${urlParams}`
        },
        "last": {
          "href": `${baseUrl}?offset=8&limit=2${urlParams}`
        },
      });
    });
  });

});
