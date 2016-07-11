var mongoose = require('mongoose');

var savedWordSchema = new mongoose.Schema({
  user: String,
  word: String,
  definition: Array,
  etymology: Array
});

module.exports = mongoose.model('savedWord', savedWordSchema);