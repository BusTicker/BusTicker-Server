// Expresssss
var express = require('express');
var app = express();

// Configure app properties
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);

// Start logger
var logger = require('morgan');
app.use(logger('dev'));

// Bring in external routes
var routes = require(__dirname + '/routes');
app.use('/', routes);


console.log("Go go gadget server.");

// Launch the server
var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});

