var wordListController = require('./wordListController.js');

module.exports = function(app) {
  app.post('/', wordListController.saveList);
  app.get('/', wordListController.getList);
};