var wordListController = require('./wordListController.js');

module.exports = function(app) {
  app.post('/save', wordListController.saveList);
  app.post('/list', wordListController.getList);
  app.post('/clear', wordListController.clearList);
  app.post('/delete', wordListController.deleteWord);
};