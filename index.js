var express = require('express');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var Q = require('q');
var Promise = require('bluebird');
var data;

var dictCall = new Promise(
  function() {
  request('http://api.wordnik.com:80/v4/word.json/' + data + '/definitions?limit=5&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function (error, response, body) {
    if(error){return console.log('Error:', error);}
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    var answer = JSON.parse(body)[0].text;
    dictData = answer;
});
});

var etymCall = new Promise(
function() {
  request('http://api.wordnik.com:80/v4/word.json/' + data + '/etymologies?useCanonical=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function (error, response, body) {
    if(error){return console.log('Error:', error);}
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    var answer = JSON.parse(body);
    console.log("WHAHWA:   ", answer);
    etymData = answer;
});
});

var something = new Promise(
  function() {
  console.log("crackers");
});

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
})

app.use(express.static(__dirname + '/'));

var dictData;
var etymData;

app.post('/api/word', function(req, res) {
    data = req.body.data;
    Promise.aggregate([
      something, dictCall, etymCall
      ]).then(function(results) {
        res.send({dictData: dictData, etymData: etymData});
    })
});
