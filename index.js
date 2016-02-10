var express = require('express');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var targetWord;

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(app.get('port'), function(){
console.log('Node app is running on port', app.get('port'));
});

app.all('/',function(req,res,next){
  console.log(req.url,req.method);
  next();
})

app.use('/', express.static(__dirname + '/'));

app.post('/', function(req, res){
  var targetWord = req.body.targetWord;
  request('http://api.wordnik.com:80/v4/word.json/' + targetWord + '/definitions?limit=5&includeRelated=true&sourceDictionaries=wiktionary&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', function (error, response, body) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }

    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    var answer = JSON.parse(body)[0].text;
    //All is good. Print the body
    res.send(answer); // Show the HTML for the Modulus homepage.

});
});
