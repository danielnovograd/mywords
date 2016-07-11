var wordListController = require('./wordListController.js');

module.exports = function(app) {
  app.post('/save', wordListController.saveList);
  app.get('/list', wordListController.getList);
};