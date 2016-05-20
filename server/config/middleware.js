var bodyParser = require('body-parser');

module.exports = function (app, express) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  var lookupRouter = express.Router();
  app.use('/api/lookups', lookupRouter);
  require('../lookups/lookupRoutes.js')(lookupRouter);
  
};

