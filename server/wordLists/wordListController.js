var request = require('request');
var Promise = require('bluebird');
var savedWord = require('../db/models/savedLookups.js');

var saveList = function(data) {
  //save new word
  var newWord = new savedWord({
    word: data.word,
    definition: data.definition,
    etymology: data.etymology
  });





  //retrieve wordList
}