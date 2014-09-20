var express = require('express');
var app = express();

app.set('port', process.env.PORT || process.env.npm_package_config_port || 3000);

var routes = require(__dirname + '/routes');
app.use('/', routes);

console.log("Go go gadget server.");

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
