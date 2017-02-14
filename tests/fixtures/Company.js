"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

require("./User");

const CompanySchema = new Schema({
  name: { type: String, required: true },
  employees: [ { type: Number, ref: "User" } ]
});

CompanySchema.plugin(autoIncrement.plugin, "Company");
module.exports = mongoose.model("Company", CompanySchema);
