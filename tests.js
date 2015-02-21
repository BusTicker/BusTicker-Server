var ArgumentParser = require('argparse').ArgumentParser;

var test = require("tap").test;

var parser = new ArgumentParser({
    version: '1.0.0',
    addHelp: true,
    description: 'app.js --apikey=API-KEY'
});

parser.addArgument([ '-p', '--provider' ], { help: 'provider'});
parser.addArgument([ '-u', '--baseurl' ], { help: 'base url'});
parser.addArgument([ '-k', '--apikey' ], { help: 'api key'});

var args = parser.parseArgs();

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

// TODO: add tests for bustime.js for bounding box and distance functions

test("Get stops", function (t) {
    provider.getStops({
        query : {
            'lat' : '43.053278377347',
            'lon' : '-87.903306511242',
            'radius' : '1' // 1 km
        }
    }).then(function(result) {
        if (result.success) {
            t.ok(result, "Result is required");
            t.ok(result.data, "Result data is required");
            console.log('Loaded ' + result.data.length + ' stops');
            t.ok(true, "Stops were loaded");
            t.end();
        }
        else {
            console.log(result.message);
            t.ok(false, "Stops were not loaded");
            t.end();
        }
    }, function(error) {
        console.log(error);
        t.ok(false, "Stops were not loaded");
        t.end();
    });
});

test("Get predictions", function (t) {
    provider.getPredictions({
        query : {
            'route' : 'GRE',
            'stop' : '1417'
        }
    }).then(function(result) {
        if (result.success) {
            t.ok(result, "Result is required");
            t.ok(result.data, "Result data is required");
            console.log('Loaded ' + result.data.length + ' predictions');
            t.ok(true, "Predictions were loaded");
            t.end();
        }
        else {
            console.log(result.message);
            t.ok(false, "Predictions were not loaded");
            t.end();
        }
    }, function(error) {
        console.log(error);
        t.ok(false, "Predictions were not loaded");
        t.end();
    });
});

test("Subsets", function (t) {
    var util = require('./providers/util');
    
    var items = [1,2,3,4,5,6,7,8,9,10,11,12];
    var subset1 = util.getSubset(items, 1, 5);
    var subset2 = util.getSubset(items, 2, 5);
    var subset3 = util.getSubset(items, 3, 5);
    var subset4 = util.getSubset(items, 2, 10);
    var subset5 = util.getSubset([], 1, 10);
    
    t.ok(subset1 && subset1.length === 5, "Subset must have 5 items");
    t.ok(subset2 && subset2.length === 5, "Subset must have 5 items");
    t.ok(subset3 && subset3.length === 2, "Subset must have 2 items");
    t.ok(subset4 && subset4.length === 2, "Subset must have 2 items");
    t.ok(subset5 && subset5.length === 0, "Subset must have 0 items");
    t.end();
});
