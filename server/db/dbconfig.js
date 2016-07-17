var mongoose = require('mongoose');
var DB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/wordrly';
mongoose.connect(DB_URI, function(err) {
  if (err) {
    console.log('connection err: ', err);
  }
  else {
    console.log('connection successful');
  }
});