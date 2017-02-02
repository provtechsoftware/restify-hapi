"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const now = new Date("2017-01-01");

const UserSchema = new Schema({
  name:       String,
  email:      { type: String, enum: ["test", "test2"], minlength: 3, maxlength: 10, match: /.*/, required: true},
  binary:     { type: Buffer, required: true },
  living:     { type: Boolean, required: true },
  updated:    { type: Date, default: now, min: now, required: true },
  age:        { type: Number, min: 18, max: 65, required: true },
  mixed:      { type: Schema.Types.Mixed, required: true },
  _someId:    { type: Schema.Types.ObjectId, required: true },
  array:      [],
  arrayTwo:   { type: Array, required: true, min: 2, max: 5 },
  ofString:   [String],
  ofNumber:   [Number],
  ofDates:    [Date],
  ofBuffer:   [Buffer],
  ofBoolean:  [Boolean],
  ofMixed:    { type: [Schema.Types.Mixed], min: 2},
  ofObjectId: [Schema.Types.ObjectId],
  nested: {
    stuff: { type: String, lowercase: true, trim: true },
    otherStuff: { type: Number, required: true }
  }
});

module.exports = mongoose.model("User", UserSchema);
