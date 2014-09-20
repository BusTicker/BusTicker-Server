var configure = function(utils) {

    var express = require('express');
    var http = require('http');
    var router = express.Router();

    var key = '6btCBLEDDeH6iHJnRbyhKHf4T';
    var api = 'http://realtime.ridemcts.com/bustime/api/v2/getpredictions?key=' + key + '&format=json';

    function getPredictions (req, res) {
        if (utils.flags.indexOf('-dev') === -1) {
            var stop = req.params.stop;
            var route = req.params.route;

            http.get(api + '&rt=' + route + '&stpid=' + stop, function(response) {
                response.setEncoding('utf8');
                var data = '';
                response.on('readable', function(){
                	var chunk;

                	while(null !== (chunk = response.read())) {
                		data += chunk;
                	}

                	data = JSON.parse(data);
                	if(!data['bustime-response']['prd'].length) {
                		res.send('No data available');
                	}else{
                        times = calculateTimes(data);
                        res.send(times);
                    }
                });

            }).on('error', function(error) {
                console.log('Got Error: ' + error);
            });
        } else {
          console.log('YOU PASSED IN -DEV')
            var dummyTimes = [7, 16];
            res.send(dummyTimes);
        }


        res.send('Request over');

    }
    router.get('/', getPredictions);
    router.get('/:stop/:route',getPredictions);

    //returns the difference in predicted time to current time for the next to stops
    var calculateTimes = function(data) {
        var predictions = [];

        var closerTime = (utils.to8601(data['bustime-response']['prd'][0].prdtm) - utils.to8601(data['bustime-response']['prd'][0].tmstmp)) / 60000;
        var fartherTime = (utils.to8601(data['bustime-response']['prd'][1].prdtm) - utils.to8601(data['bustime-response']['prd'][1].tmstmp)) / 60000;

        predictions.push(closerTime);
        predictions.push(fartherTime);

        return predictions;
    }

    return router;
}

module.exports.configure = configure;
