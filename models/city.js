const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  country: String,
  range: Number,
  image: String,
});

module.exports = mongoose.model('City', schema);
