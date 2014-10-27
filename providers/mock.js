
var when = require('when');
var util = require('./util');

var processArgs = function(args) {
    // do nothing
};

exports.processArgs = processArgs;

var getStops = function(req) {
    var lat = req.query.lat;
    var lon = req.query.lon;
    var radius = req.query.radius;
    var page = parseInt(req.query.page, 10) || 1;
    var pageSize = parseInt(req.query.pageSize, 10) || 20;

    return when.promise(function(resolve, reject) {
        var stops = require('./mockdata/stops.json');
        var subset = util.getSubset(stops, page, pageSize);
        if (lat && lon && radius) {
            resolve({
                'success': true,
                'message': 'OK',
                'data': subset
            });
        }
        else {
            reject({
                'success': false,
                'message': 'Bad request. Make sure you have a latitude, longitude and radius on the query string.',
                'data': {}
            });
        }
    });
};

exports.getStops = getStops;

var getPredictions = function(req) {
    var route = req.query.route;
    var stop = req.query.stop;

    return when.promise(function(resolve, reject) {
        if (route && stop) {
            resolve({
                'success': true,
                'message': 'OK',
                'data': require('./mockdata/predictions.json')
            });
        }
        else {
            reject({
                'success': false,
                'message': 'Bad request. Make sure you have a route and a stop ID on the query string.',
                'data': {}
            });
        }
    });
};

exports.getPredictions = getPredictions;
