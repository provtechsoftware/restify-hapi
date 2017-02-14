"use strict";

const expect = require("chai").expect;

describe("The FindAllHandler module", function() {

  it("fetches for all resources", function (done) {
    this.server.inject({ method: "GET", "url": "/api/v1/users"}, (res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.have.property("_links");
      expect(res.result).to.have.property("_total");
      expect(res.result).to.have.property("_count");
      expect(res.result).to.have.property("records").that.deep.equals([]);
      done();
    });
  });

});
