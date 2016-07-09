var mongoose = require('mongoose');

var savedLookupSchema = new mongoose.Schema({
  word: String,
  definition: Array,
  etymology: Array
})

module.exports = mongoose.model('savedLookups', savedLookupSchema);