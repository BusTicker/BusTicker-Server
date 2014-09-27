// Expresssss
var express = require('express');
var Promise = require('promise');
var app = express();

// Configure app properties
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
var utils = require(__dirname + '/utilities/utils');

utils.flags = [];
process.argv.forEach(function(value, index, array) {
    if (index > 1) { // ignores node <file.js>
        utils.flags.push(value);
    }
});

// Instantiate route provider
var Provider;
if (utils.flags.indexOf('-dev') == -1) {
    Provider = require('./MctsProvider');
} else {
    Provider = require('./MockProvider');
}

// Start logger
var logger = require('morgan');
app.use(logger('dev'));

// Create routes
app.get('/predictions', function(req, res) {
    var route = req.query.route;
    var stop = req.query.stop;

    var promise = new Promise(function(resolve, reject) {
        if (route && stop) {
        	var data = Provider.getPredictions();
            resolve(data);
        } else {
            reject("Bad request. Make sure you have a route and a stop ID on the query string.");
        }
    });

    promise.then(function(data) {
    	var response = {
    		'success': true,
    		'message': 'OK',
    		'data': data
    	};
        res.send(response);
    }, function(error) {
    	var response = {
    		'success': false,
    		'message': error,
    		'data': {}
    	};
        res.send(response);
    });
});

app.get('/stops', function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var radius = req.query.radius;
	var page = req.query.page || 1;
	var pageSize = req.query.pageSize || 20;

	var promise = new Promise(function(resolve, reject) {
        if (lat && lon && radius) {
        	var data = Provider.getStops();
            resolve(data);
        } else {
            reject("Bad request. Make sure you have a latitude, longitude and radius on the query string.");
        }
    });

    promise.then(function(data) {
    	var response = {
    		'success': true,
    		'message': 'OK',
    		'data': data
    	};
        res.send(response);
    }, function(error) {
    	var response = {
    		'success': false,
    		'message': error,
    		'data': {}
    	};
        res.send(response);
    });
});

// Launch the server
var server = app.listen(app.get('port'), function() {
    console.log('  Server started.\nListening on port %d', server.address().port);
});
