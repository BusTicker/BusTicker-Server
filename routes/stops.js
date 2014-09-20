var configure = function(utils) {

  var express = require('express');
  var router = express.Router();

  function jsonMockData(req, res) {
    var mockData = require(__dirname+"/sample data/dummy_stops.json");
    res.json(mockData);
  }

  router.get('/',jsonMockData);
  router.get('/:anything',jsonMockData);
  return router;
}

module.exports.configure = configure;