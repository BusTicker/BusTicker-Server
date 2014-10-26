
var express = require('express');
var app = express();
var ArgumentParser = require('argparse').ArgumentParser;

// Configure app properties
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);

var parser = new ArgumentParser({
    version: '1.0.0',
    addHelp: true,
    description: 'app.js --apikey=API-KEY'
});

parser.addArgument([ '-p', '--provider' ], { help: 'provider'});
parser.addArgument([ '-u', '--baseurl' ], { help: 'base url'});
parser.addArgument([ '-k', '--apikey' ], { help: 'api key'});

var args = parser.parseArgs();

console.log(args);

var provider;
if (args.provider === 'mock') {
    provider = require('./providers/mock');
}
else if (args.provider === 'mcts') {
    provider = require('./providers/mcts');
}
else {
    provider = require('./providers/mcts');
}

provider.processArgs(args);

var logger = require('morgan');
app.use(logger(args.provider));

app.get('/predictions', function(req, res) {
    provider.getPredictions(req).then(function(response) {
        console.log('success: ' + response);
        res.send(response);
    }, function(response) {
        console.log('fail: ' + response);
        res.send(response);
    });
});

app.get('/stops', function(req, res) {
    provider.getStops(req).then(function(response) {
        console.log('success: ' + response);
        res.send(response);
    }, function(response) {
        console.log('fail: ' + response);
        res.send(response);
    });
});

var server = app.listen(app.get('port'), function() {
    console.log('Server started.\nListening on port %d', server.address().port);
});
