var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todoApp', function(err) {
  if (err) {
    console.log('connection err: ', err);
  }
  else {
    console.log('connection successful');
  }
});