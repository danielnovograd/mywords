var request = require('request');
var Promise = require('bluebird');
var savedWord = require('../db/models/savedLookups.js');

var defaultUser = 'dan'

module.exports = {
  saveList: function(req, res) {

    var newWord = new savedWord({
      user: defaultUser,
      word: req.body.word,
      definition: req.body.definition,
      etymology: req.body.etymology
    });

    newWord.save().then(function(word) {
      savedWord.find().then(function(list) {
        res.send(list);
      })
    })
    .catch(function(err) {
      console.log("ERROR", err)
    });
  },

  getList: function(data) {
    return new Promise(function(resolve, reject) {
      savedWord.find(function(err, list) {
        if (err) {
          console.log("an error occurred trying to find the list");
        } else if (list) {
          resolve(list)
        }
      })
    });
  }
}
