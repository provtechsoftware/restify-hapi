"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: String
});

CompanySchema.plugin(autoIncrement.plugin, "Company")
module.exports = mongoose.model("Company", CompanySchema);
