"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true }
});

CompanySchema.plugin(autoIncrement.plugin, "Company");
module.exports = mongoose.model("Company", CompanySchema);
