var utilities = {};

utilities.key = '6btCBLEDDeH6iHJnRbyhKHf4T'; // API key
utilities.api = 'http://realtime.ridemcts.com/bustime/api/v2'; // base url for the api

// Converter to adjust MCTS API dates to a more standard format. We should use a library for this soon though.
utilities.toDate = function(timeStr) {
    var time = new Date(timeStr.substring(0, 4) + "-" + timeStr.substring(4, 6) + "-" + timeStr.substring(6, 8) + " " + timeStr.substring(10, 15));
    return Date.parse(time);
}

// Reasonable approximation of ground distances based on lat&lon
// As described by census.gov. Thanks to http://andrew.hedges.name/experiments/haversine/
utilities.haversineDistance = function(lat1, lon1, lat2, lon2) {
    var d2r = function(degrees) {
        return degrees * Math.PI / 180;
    };
    lat1 = d2r(lat1);
    lat2 = d2r(lat2);
    lon1 = d2r(lon1);
    lon2 = d2r(lon2);
    var dlon = lon2 - lon1;
    var dlat = lat2 - lat1;
    var a = Math.pow((Math.sin(dlat / 2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin(dlon / 2)), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (3958.7 * c);
}

module.exports = utilities;
