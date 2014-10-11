(function () {
    var configure = function (utils) {
        var when = require('when');
        var bt = require('./bustime');
        bt.processArguments(utils.flags);
        bt.setBaseUrl('http://realtime.ridemcts.com/bustime/api/v2/');

        var getStopsBuilder = function(req, data) {
            return function(req) {
                return when.resolve(data.stops);  // filler; here we need to actually filter the stops by the criteria in the request
            };
        }; 
        var getPredictions = function(req) {
            var route = req.query.route;
            var stop = req.query.stop;
            var direction = req.query.direction;

            if (route && stop && direction) {
              bt.fetchPredictions(route, direction, stop).then(function (predictions) {
                return predictions; // again need to actually use some criteria here and double-check our arguments etc
              });
            } else {

            }
        }
        var getStops;

        bt.loadData().then(function(data) {
            getStops = getStopsBuilder(data);

            console.log(Object.keys(data.routes).length + ' routes');
            console.log(Object.keys(data.stops).length + ' stops');

        }).catch(function(e){
            console.log('Error: ' + e);
        });

        var provider = {};
        provider.bt = bt;
        return provider;
    }

    exports.configure = configure;
}();