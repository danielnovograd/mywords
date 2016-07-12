var mongoose = require('mongoose');

var savedWordSchema = new mongoose.Schema({
  user: String,
  wordList: Array
});

module.exports = mongoose.model('savedWord', savedWordSchema);