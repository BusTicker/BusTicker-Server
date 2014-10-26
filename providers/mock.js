
var when = require('when');

exports.processArgs = function(args) {
    // do nothing
};

exports.prepareData = function() {
    return when.resolve();
};

exports.getStops = function(req) {
    var lat = req.query.lat;
    var lon = req.query.lon;
    var radius = req.query.radius;
    var page = req.query.page || 1;
    var pageSize = req.query.pageSize || 20;

    return when.promise(function(resolve, reject) {
        if (lat && lon && radius) {
            resolve({
                'success': true,
                'message': 'OK',
                'data': require('./mockdata/dummy_stops.json')
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
}

exports.getPredictions = function(req) {
    var route = req.query.route;
    var stop = req.query.stop;

    return when.promise(function(resolve, reject) {
        if (route && stop) {
            resolve({
                'success': true,
                'message': 'OK',
                'data': [7, 16]
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
