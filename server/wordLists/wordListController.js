var request = require('request');
var Promise = require('bluebird');
var savedWord = require('../db/models/savedLookups.js');

var defaultUser = 'dan';

module.exports = {
  saveList: function(req, res) {
    savedWord.findOneAndUpdate(
      { user: { $eq: req.body.user } },
      { $push: { wordList: req.body.word } },
      {
        new: true,
        upsert: true
      })
      .then(function(userDoc) {
        res.send(userDoc.wordList);
      });
  },

  getList: function(req, res) {
    savedWord.findOne({ user: { $eq: req.body.user } })
      .then(function(userDoc) {
        res.send(userDoc.wordList);
      })
      .catch(function(error) {
        res.send("getList error: ", error);
      });
  },

  deleteWord: function(req, res) {
    savedWord.findOneAndUpdate(
      { user: { $eq: req.body.user } },
      { $pull: { wordList: {word: req.body.word} } },
      { new: true })
      .then(function(userDoc) {
        res.send(userDoc.wordList);
      }).catch(function(error) {
        res.send("deleteWord error: ", error);
      });
  },

  clearList: function(req, res) {
    savedWord.findOneAndUpdate(
      { user: { $eq: defaultUser } },
      { wordList: [] })
      .then(function(userDoc) {
        res.send(userDoc.wordList);
      })
      .catch(function(error) {
        res.send("clearList error: ", error);
    });
  }
};
