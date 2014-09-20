var configure = function(utils) {

    var express = require('express');
    var router = express.Router();

    function jsonMockData(req, res) {
        var mockData = require(__dirname + "/sample data/dummy_stops.json");
        res.json(mockData);
    }

    // approx number of meters per degree lat & lon
    // lon is valid ONLY for this approx lat (MKE area)
    var METERS_PER_LON = 79000;
    var METERS_PER_LAT = 111000;



    router.get('/', jsonMockData);
    router.get('/:lat/:lon/:radius', jsonMockData);
    router.get('/:lat/:lon/:radius/:page', jsonMockData);
    router.get('/:lat/:lon/:radius/:page/:pagesize', jsonMockData);
    router.use(function(req, res) {
        res.send("Unknown API format.");
    });
    return router;
}

module.exports.configure = configure;
