var request = require('request');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var chalk = require('chalk');
var opts = require("nomnom").parse();
// var bodyParser = require('body-parser');

var dictCall = function(data) {
  return new Promise(function(resolve, reject) {
    request('http://api.wordnik.com:80/v4/word.json/' + data + '/definitions?limit=5&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function(error, response, body) {
      if (error) {
        return console.log('Error:', error);
      }
      if (response.statusCode !== 200) {
        return console.log('Invalid Status Code Returned:', response.statusCode);
      }
      var answer = JSON.parse(body);
      resolve(answer);
    });
  });
};

var etmyCall = function(data) {
  var etymology = [];
  var url = 'http://www.etymonline.com/index.php?term=' + data + '&allowed_in_frame=0';
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error('no results found.');
        return;
      }
      var $ = cheerio.load(body);
      var defs = $('#dictionary dl > *');
      var twople = {};
      defs.each(function(d, el) {
        if (el.name === 'dt') {
          twople.entry = $(el).text().trim();
        }
        if (el.name === 'dd') {
          twople.etymology = $(el).text().trim() + '\n';
        }
        if (twople.etymology) {
          etymology.push(twople);
          twople = {};
        }
      });
      resolve(etymology);
    });

  });
};

module.exports = {

  query: function(req, res) {
    var first = dictCall(req.body.data);
    var second = etmyCall(req.body.data);
    Promise.all([
      first, second
    ]).then(function(results) {
      res.send(results);
    }).catch(function() {
      console.log("Some kind of error!");
    });
  }
};
