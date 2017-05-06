"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

require("./Company");

const dummyDate = new Date("2017-01-01");
const now = new Date();

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
  _archived: { type: Boolean, default: false }
});

UserSchema.plugin(autoIncrement.plugin, "User");
module.exports = mongoose.model("User", UserSchema);
