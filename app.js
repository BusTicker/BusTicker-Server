// Expresssss
var express = require('express');
var utils = require('./utils');
var app = express();

// Configure app properties
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);

utils.flags = [];
process.argv.forEach(function(value, index, array) {
    if (index > 1) { // ignores node <file.js>
        utils.flags.push(value);
    }
    console.log("flag: " + value);
});

// Set up bustime service
var when = require('when');
var bt = require('./bustime');
bt.processArguments(utils.flags);
bt.setBaseUrl('http://realtime.ridemcts.com/bustime/api/v2/');

bt.loadData().then(function(data) {
    console.log(Object.keys(data.routes).length + ' routes');
    console.log(Object.keys(data.stops).length + ' stops');
}).catch(function(e){
    console.log('Error: ' + e);
});



// Instantiate route provider
var Provider;
if (utils.flags.indexOf('-dev') == -1) {
    Provider = require('./mctsProvider');
} else {
    Provider = require('./mockProvider');
}

// Start logger
var logger = require('morgan');
app.use(logger('dev'));

// Create routes
app.get('/predictions', function(req, res) {
	Provider.getPredictions(req).then(function(response) {
		console.log('success: ' + response);
		res.send(response);
	}, function(response) {
		console.log('fail: ' + response);
		res.send(response);
	});
});

app.get('/stops', function(req, res) {
    Provider.getStops(req).then(function(response) {
		console.log('success: ' + response);
		res.send(response);
	}, function(response) {
		console.log('fail: ' + response);
		res.send(response);
	});
});

// Launch the server
var server = app.listen(app.get('port'), function() {
    console.log('  Server started.\nListening on port %d', server.address().port);
});
