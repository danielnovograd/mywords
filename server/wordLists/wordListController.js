var request = require('request');
var Promise = require('bluebird');
var savedWord = require('../db/models/savedLookups.js');
var _ = require('lodash');

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
      savedWord.find({user: {$eq: defaultUser}}).then(function(list) {
        res.send(_.map(list, function(entry) {
          return entry.word;
        }));
      })
    })
    .catch(function(err) {
      console.log("ERROR", err)
    });
  },

  getList: function(req, res) {
    console.log(req.body.user);
    savedWord.find({user: {$eq: req.body.user}})
    .then(function(list) {
      res.send(_.map(list, function(entry) {
        return entry.word;
      })
      );
    })
  },

  clearList: function(req, res) {
    savedWord.remove({user: {$eq: defaultUser}})
    .then(function(list) {
      list.find({user: {$eq: defaultUser}})
      .then(function(list) {
        res.send(_.map(list, function(entry) {
          return entry.word;
        }))
      })
    })
  }
}
