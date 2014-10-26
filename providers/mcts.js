
var when = require('when');
var bustime = require('./bustime');

var isDataReady = false;

exports.processArgs = function(args) {
    bustime.setProvider(args.provider);
    bustime.setBaseUrl(args.baseurl);
    bustime.setApiKey(args.apikey);
};

exports.prepareData = function() {
    return when.promise(function(resolve, reject) {
        bustime.loadData().then(function(data) {
            console.log("Data is ready");
            isDataReady = true;
            resolve();
        }).catch(function(error){
            console.log('Error: ' + error);
            reject(error);
        });
    });
};

exports.getStops = function(req) {
    if (!isDataReady) {
        return when.reject('Data is not ready');
    }
    
    var lat = req.query.lat;
    var lon = req.query.lon;
    var radius = req.query.radius; // expected unit is kilometers
    var page = req.query.page || 1;
    var pageSize = req.query.pageSize || 20;

    return when.promise(function(resolve, reject) {
        if (lat && lon && radius) {
            bustime.lookupStops(lat, lon, radius).then(function(stops) {
                resolve({
                    'success': true,
                    'message': 'OK',
                    'data': stops
                });
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

exports.getPredictions = function(req) {
    var route = req.query.route;
    var stop = req.query.stop;
    
    return when.promise(function(resolve, reject) {
        if (route && stop) {
            bustime.fetchPredictions(route, stop).then(function(result) {
                resolve({
                    'success': true,
                    'message': 'OK',
                    'data': result
                });
            }, function(error) {
                reject({
                    'success': false,
                    'message': 'Bad request. Make sure you have a route and a stop ID on the query string.',
                    'data': {}
                });
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
