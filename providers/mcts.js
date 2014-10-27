
var when = require('when');
var bustime = require('./bustime');
var util = require('./util');

var processArgs = function(args) {
    bustime.setProvider(args.provider);
    bustime.setBaseUrl(args.baseurl);
    bustime.setApiKey(args.apikey);
};

exports.processArgs = processArgs;

var getStops = function(req) {
    if (!bustime.isDataCurrent()) {
        return bustime.loadData().then(function() {
            return getStops(req);
        });
    }

    var lat = req.query.lat;
    var lon = req.query.lon;
    var radius = req.query.radius; // expected unit is kilometers
    var page = parseInt(req.query.page, 10) || 1;
    var pageSize = parseInt(req.query.pageSize, 10) || 20;

    return when.promise(function(resolve, reject) {
        if (lat && lon && radius) {
            bustime.lookupStops(lat, lon, radius).then(function(stops) {
                var subset = util.getSubset(stops, page, pageSize);
                
                resolve({
                    'success': true,
                    'message': 'OK',
                    'data': subset
                });
            }, function(error) {
                reject(error);
            });
        }
        else {
            reject("Bad request. Make sure you have a latitude, longitude and radius on the query string.");
        }
    });
};

exports.getStops = getStops;

var getPredictions = function(req) {
    var route = req.query.route;
    var stop = req.query.stop;
    
    return when.promise(function(resolve, reject) {
        if (route && stop) {
            bustime.fetchPredictions(route, stop).then(function(predictions) {
                resolve({
                    'success': true,
                    'message': 'OK',
                    'data': predictions
                });
            }, function(error) {
                reject("Bad request. Make sure you have a route and a stop ID on the query string.");
            });
        }
        else {
            reject("Bad request. Make sure you have a route and a stop ID on the query string.");
        }
    });
};

exports.getPredictions = getPredictions;
