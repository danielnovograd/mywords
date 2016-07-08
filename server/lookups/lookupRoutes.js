var lookupController = require('./lookupController.js');

module.exports = function(app){
    app.post('/query', lookupController.query);
};