var configure = function(utils) {

  var express = require('express');
  var http = require('http');
  var router = express.Router();

  var key = '6btCBLEDDeH6iHJnRbyhKHf4T';
  var api = 'http://realtime.ridemcts.com/bustime/api/v2/getpredictions?key=' + key + '&format=json';

  router.get('/', function(req,res) {
  	var stop = 5955;//req.params.stop;
  	var route = 'RED';//req.params.route;

  	var predictions = [];

  	http.get(api + '&rt=' + route + '&stpid=' + stop, function(response){
  		response.setEncoding('utf8');
  		response.on('data', function(data){
  			data = JSON.parse(data);

  			var closerTime = (utils.to8601(data['bustime-response']['prd'][0].prdtm) - utils.to8601(data['bustime-response']['prd'][0].tmstmp)) / 60000;
  			var fartherTime = (utils.to8601(data['bustime-response']['prd'][1].prdtm) - utils.to8601(data['bustime-response']['prd'][1].tmstmp)) / 60000;

  			console.log('Next: ' + closerTime + '\n' + 'After that: ' + fartherTime);
  			predictions.push(closerTime);
  			predictions.push(fartherTime);
  			console.log(predictions);
  		});
  	}).on('error', function(error){
  		console.log('Got Error: ' + error);
  	});

  	res.send('Request over');

  });

  return router;
}

module.exports.configure = configure;