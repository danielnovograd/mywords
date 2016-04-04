var express = require('express');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var app = express();
var cheerio = require('cheerio');
var chalk = require('chalk');
var opts = require("nomnom").parse();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

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
}

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
            defs.each(function(d, el) {
                if (el.name === 'dt') {
                    // console.log('\n' + chalk.bold($(el).text()) + '\n');
                }
                if (el.name === 'dd') {
                    // console.log($(el).text().trim() + '\n');
                    etymology.push($(el).text().trim() + '\n');
                }
            });
            resolve(etymology);
        });

    });
};

app.use(express.static(__dirname + '../../client'));

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
