var configure = function(utils) {

  var express = require('express');
  var router = express.Router();

  function getMockData(res) {
    var mockData = require("sample data/dummy_stops.json");
    res.json(mockData);
  }

  router.get('/',function(req,res) {res.send("STOPS");});
  return router;
}

module.exports.configure = configure;