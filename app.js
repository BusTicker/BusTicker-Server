// Expresssss
var express = require('express');
var app = express();

// Configure app properties
app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);
var utils = []; // later this will hold important stuff that our modules need

// Start logger
var logger = require('morgan');
app.use(logger('dev'));

// Bring in external routes
var routes = require(__dirname + '/routes').configure()
app.use('/', routes);

// Launch the server
var server = app.listen(app.get('port'), function() {
    console.log('  Server started.\nListening on port %d', server.address().port);
});
