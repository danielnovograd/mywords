var bodyParser = require('body-parser');

module.exports = function (app, express) {
  var customerRouter = express.Router();
  var bartenderRouter = express.Router();
  var menuRouter = express.Router();
  var barqueueRouter = express.Router();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

};

