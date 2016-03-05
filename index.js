var express = require('express');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var $ = require('jquery');
var app = express();

var dictCall = function(data) {
  return new Promise(function(resolve, reject) {
    request('http://api.wordnik.com:80/v4/word.json/' + data + '/definitions?limit=5&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function (error, response, body) {
      if(error){return console.log('Error:', error);}
      if(response.statusCode !== 200) {
        return console.log('Invalid Status Code Returned:', response.statusCode);
      }
      var answer = JSON.parse(body)[0].text;
      resolve(answer);
    });
  });
}

var etmyCall = function(data) {
 return new Promise(function(resolve, reject) {
  request('http://api.wordnik.com:80/v4/word.json/' + data + '/etymologies?useCanonical=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function (error, response, body) {
    if(error){return console.log('Error:', error);}
    if(response.statusCode !== 200) {
      return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    var answer = JSON.parse(body);
    console.log(answer);
    resolve(answer);
    });
  });
}

var something = function() {
  console.log("crackers");
};

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.all('/', function(req, res, next) {
    console.log(req.url, req.method);
    next();
});

app.use(express.static(__dirname + '/'));

app.post('/api/word', function(req, res) {
  var first = dictCall(req.body.data);
  var second = etmyCall(req.body.data);
  Promise.all([
    first, second
    ]).then(function(results) {
      res.send(results);
    }).catch(function() {
      console.log("Some kind of error!");
    });
});
