#! /usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
var chalk = require('chalk');
var opts = require("nomnom").parse();

var query = opts._.join('%20');

var url = 'http://www.etymonline.com/index.php?term=' + query + '&allowed_in_frame=0';

request(url, function (error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('no results found.');
    return;
  }
  var $ = cheerio.load(body);
  var defs = $('#dictionary dl > *');
  defs.each(function (d, el) {
    if (el.name === 'dt') {
      console.log('\n' + chalk.bold($(el).text()) + '\n');
    }
    if (el.name === 'dd') {
      console.log($(el).text().trim() + '\n');
    }
  });
});
