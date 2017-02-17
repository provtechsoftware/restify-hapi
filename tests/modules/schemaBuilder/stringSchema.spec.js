"use strict";

const expect = require("chai").expect;

const StringSchema = require("../../../lib/schemaBuilder/stringSchema");
const Validator = require("../../../lib/tools/validator");

describe("The StringSchema module", function() {

  it("parses a simple string", function() {
    const options = {};
    const schema = StringSchema.toJoi(this.User.schema.paths.name, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._type).to.equal("string");
    expect(schema._description).to.equal("this resources name field");
  });

  it("parses a complex string", function() {
    const options = {};
    const schema = StringSchema.toJoi(this.User.schema.paths.email, options, this.dispatcher);

    expect(schema.isJoi).to.equal(true);
    expect(schema._flags).to.have.property("presence");
    expect(schema._flags.presence).to.equal("required");
    expect(schema._tests).to.have.length(3);
    expect(schema._tests).to.have.deep.property("[0].name", "min");
    expect(schema._tests).to.have.deep.property("[0].arg", 3);
    expect(schema._tests).to.have.deep.property("[1].name", "max");
    expect(schema._tests).to.have.deep.property("[1].arg", 20);
    expect(schema._tests).to.have.deep.property("[2].name", "email");
  });

  it("skips required if specified so in options", function() {
    const options = {
      skipRequired: true
    };
    const schema = StringSchema.toJoi(this.User.schema.paths.email, options);

    expect(schema._flags).to.deep.equal({
      "default": "example@user.com"
    });
  });

  it("generates a valid default value if non is present", function() {
    const schema = {
      path: "string",
      isRequired: false,
      options: {},
    };
    const defaultValue = StringSchema.generateDefaultValue(schema);

    expect(defaultValue).to.equal("string");
  });

  it("applies the default value if one is given by the resource schema", function() {
    const defaultString = "default string";
    const schema = {
      path: "string",
      isRequired: false,
      options: {
        default: defaultString
      },
      defaultValue: defaultString
    };
    const defaultValue = StringSchema.generateDefaultValue(schema);

    expect(defaultValue).to.equal(defaultString);
  });

  it("applies a valid default password value if non is given by the resource schema", function() {
    const schema = {
      path: "password",
      isRequired: false,
      options: {}
    };
    const passwordValidatorSettings = {
      minlength: 8,
      numbers: false,
      uppercase: false,
      special: false
    };
    const defaultValue = StringSchema.generateDefaultValue(schema);
    const passwordError = Validator.validatePassword(defaultValue, passwordValidatorSettings);

    expect(passwordError).to.equal(null);
  });

});
