"use strict";

const expect = require("chai").expect;

describe("The FindOneHandler module", function() {

  it("fetches one resource", function (done) {
    this.server.inject({ method: "GET", "url": "/api/v1/users/0"}, (res) => {
      expect(res.statusCode).to.equal(404);
      done();
    });
  });

});
