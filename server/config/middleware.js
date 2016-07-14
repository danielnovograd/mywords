var bodyParser = require('body-parser');

module.exports = function(app, express) {
  var lookupRouter = express.Router();
  var wordListRouter = express.Router();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/lookups', lookupRouter);
  app.use('/api/wordList', wordListRouter);

  require('../wordLists/wordListRoutes.js')(wordListRouter);
  require('../lookups/lookupRoutes.js')(lookupRouter);
};
