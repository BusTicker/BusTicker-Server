(function() {
    var Promise = require('promise');

    var getPredictionsMock = function(req) {
        var route = req.query.route;
        var stop = req.query.stop;

        if (route && stop) {
            return Promise.resolve({
                'success': true,
                'message': 'OK',
                'data': [7, 16]
            });
        } else {
            return Promise.reject({
                'success': false,
                'message': 'Bad request. Make sure you have a route and a stop ID on the query string.',
                'data': {}
            });
        }
    }

    var getStopsMock = function(req) {
        var lat = req.query.lat;
        var lon = req.query.lon;
        var radius = req.query.radius;
        var page = req.query.page || 1;
        var pageSize = req.query.pageSize || 20;

        if (lat && lon && radius) {
            return Promise.resolve({
                'success': true,
                'message': 'OK',
                'data': require('./sample data/dummy_stops.json')
            });
        } else {
            return Promise.reject({
                'success': false,
                'message': 'Bad request. Make sure you have a latitude, longitude and radius on the query string.',
                'data': {}
            });
        }
        
    }

    exports.getPredictions = getPredictionsMock;
    exports.getStops = getStopsMock;
})();