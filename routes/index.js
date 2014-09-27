// var configure = function(utils) {

//     var express = require('express');
//     var router = express.Router();

//     var utils = require(__dirname + '/../utilities/utils');

//     var stops = require(__dirname + '/stops.js').configure(utils);
//     router.use('/stops', stops);
//     var predictions = require(__dirname + '/predictions.js').configure(utils);
//     router.use('/predictions', predictions);

//     router.get('', function(req, res) {
//         res.send("Welcome to the default directory");
//     })
//     return router;
// }

// module.exports.configure = configure;
