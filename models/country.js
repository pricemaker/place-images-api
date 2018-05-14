const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  image: String,
});

module.exports = mongoose.model('Country', schema);
