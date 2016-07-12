var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI, function(err) {
  if (err) {
    console.log('connection err: ', err);
  }
  else {
    console.log('connection successful');
  }
});