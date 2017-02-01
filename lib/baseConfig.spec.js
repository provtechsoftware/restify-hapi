"use strict";

const expect = require("chai").expect;

const baseConfig = require("./baseConfig");

describe("The baseConfig module", function() {
  it("builds the default config for User", function * () {
    const options = {};
    const config = baseConfig.generate(this.User, options);

    expect(config.auth).to.equal(false);
    expect(config.routes).to.have.property("findAll");
    expect(config.routes.findAll.path).to.equal("/api/v1/users");
  });

  it("builds the default config for Company", function * () {
    const options = {};
    const config = baseConfig.generate(this.Company, options);

    expect(config.auth).to.equal(false);
    expect(config.routes).to.have.property("findAll");
  });

  it("builds the Customer paths with custom single and multi values", function * () {
    const options = {
      single: "company",
      multi: "companies"
    };
    const config = baseConfig.generate(this.Company, options);

    expect(config.routes.findAll.path).to.equal("/api/v1/companies")
  });
});