var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

require('./config/middleware.js')(app, express);

module.exports = app;

if(!module.parent){
  app.listen(port, function () {
    console.log('Server now listening on port ' + port);
  });
};
