var stops = require(__dirname + "/sample data/stop_collection.json").stops;
var loc = {};
digits = 4;

stops.forEach(function(stopObject, index, array) {
    lat = stopObject.lat;
    lon = stopObject.lon;
    tree = [lat | 0, lon | 0];
    lat = Math.abs(lat);
    lon = Math.abs(lon);
    lat -= lat | 0;
    lon -= lon | 0;
    for (i = 0; i < digits; i++) {
        lat *= 10;
        tree.push
    }

});
