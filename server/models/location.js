// models/Location.js
const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  }
});
module.exports = locationSchema;