(function() {

    var getPredictionsMock = function() {
        var dummyTimes = [7, 16];

        return dummyTimes;
    }

    var getStopsMock = function() {
        var mockData = require('./sample data/dummy_stops.json');

        return mockData;
    }

    exports.getPredictions = getPredictionsMock;
    exports.getStops = getStopsMock;
})();
