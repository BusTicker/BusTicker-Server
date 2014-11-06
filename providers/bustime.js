var when = require('when');
var rest = require('rest');
var fs = require('fs');
var haversine = require('haversine');

//// Utility Methods ////

var qs = function(params) {
    var pairs = [];
    var keys = Object.keys(params);
    for (var i=0;i<keys.length;i++) {
        var key = keys[i];
        pairs.push(encodeURI(key) + '=' + encodeURI(params[key]));
    }

    return '?' + pairs.join('&');
};

// allows promises to be passed in as an array
var waitForPromises = function(promises) {
    return when.join.apply(this, promises);
};

var fetchBusTimeResponse = function(url, params) {
    url = url + qs(params);
    //console.log('url: ' + url);
    return when.promise(function(resolve, reject) {
        rest(url).then(function(response) {
            var json = JSON.parse(response.entity);
            var bustimeResponse = json['bustime-response'];
            if (bustimeResponse.error) {
                var error = bustimeResponse.error[0];
                reject(error.msg);
            }
            else {
                resolve(bustimeResponse);
            }
        });
    });
};

var parseETA = function(timestamp) {
    // timestamp : "20140927 14:30"
    if (timestamp.length === 14) {
        var year = parseInt(timestamp.substring(0, 4), 10);
        var month = parseInt(timestamp.substring(4, 6), 10);
        var day = parseInt(timestamp.substring(6, 8), 10);
        var hour = parseInt(timestamp.substring(9, 11), 10);
        var minute = parseInt(timestamp.substring(12, 14), 10);

        return new Date(year, month - 1, day, hour, minute, 0, 0);
    }
    else {
        return null;
    }
};

var isDateAfterMinutesAgo = function(date, minutes) {
    var minutesAgo = new Date(new Date().getTime() - (minutes * 60000));
    return date > minutesAgo;
};

exports.qs = qs;
exports.waitForPromises = waitForPromises;
exports.parseETA = parseETA;
exports.isDateAfterMinutesAgo = isDateAfterMinutesAgo;

//// API Configuration ////

var provider = 'mcts'; // default
var baseUrl = 'http://realtime.ridemcts.com/bustime/api/v2/'; // default
var apiKey = ''; // no default (developer must provide their own key)

var setProvider = function(p) {
    provider = p;
};

var setBaseUrl = function(url) {
    if (url.length > 0) {
        baseUrl = url;
    }
};

var setApiKey = function(key) {
    apiKey = key;
};

exports.setProvider = setProvider;
exports.setBaseUrl = setBaseUrl;
exports.setApiKey = setApiKey;

//// API Calls ////

var fetchRoutes = function() {
    var url = baseUrl + 'getroutes';
    var params = {'key' : apiKey, 'format' : 'json'};
    return fetchBusTimeResponse(url, params).then(function(response) {
        var routes = response.routes;
        return when.promise(function(resolve, reject) {
            var myRoutes = [];

            for (var i=0;i<routes.length;i++) {
                var route = routes[i];
                myRoutes.push({'id' : route.rt, 'name' : route.rtnm, 'color' : route.rtclr});
            }
            resolve(myRoutes);
        });
    });
};

var fetchDirections = function(route) {
    var url = baseUrl + 'getdirections';
    var params = {'key' : apiKey, 'format' : 'json', 'rt' : route.id};

    return fetchBusTimeResponse(url, params).then(function(response) {
        return when.promise(function(resolve, reject) {
            var directions = [];
            for (var j=0;j<response.directions.length;j++) {
                directions.push(response.directions[j].dir);
            }
            route.directions = directions;
            resolve(route);
        });
    });
};

var fetchStops = function(route, direction) {
    var url = baseUrl + 'getstops';
    var params = {'key' : apiKey, 'format' : 'json', 'rt' : route.id, 'dir' : direction};

    return fetchBusTimeResponse(url, params).then(function(response) {
        return when.promise(function(resolve, reject) {
            var stops = [];
            for (var i=0;i<response.stops.length;i++) {
                var stop = response.stops[i];
                var myStop =  {
                    'id' : stop.stpid,
                    'name' : stop.stpnm,
                    'latitude' : stop.lat,
                    'longitude' : stop.lon,
                    'routeId' : route.id,
                    'direction' : direction
                };
                stops.push(myStop);
            }
            route.stops = stops;
            resolve(route);
        });
    });
};

var fetchPredictions = function(route, stop) {
    var url = baseUrl + 'getpredictions';
    var params = {'key' : apiKey, 'format' : 'json', 'rt' : route, 'stpid' : stop};

    return fetchBusTimeResponse(url, params).then(function(response) {
        return when.promise(function(resolve, reject) {
            var predictions = [];
            for (var i=0;i<response.prd.length;i++) {
                var eta = parseETA(response.prd[i].prdtm);
                var myPrediction = {'eta' : eta !== null ? eta.toISOString() : ''};
                predictions.push(myPrediction);
            }
            resolve(predictions);
        });
    });
};

exports.fetchPredictions = fetchPredictions;

//// Bounding Box ////

var getBoundingBox = function(latitude, longitude, radKm) {
    var toRadian = function(degree) {
        return degree * Math.PI / 180;
    };

    var toDegree = function(radian) {
        return radian * 180 / Math.PI;
    };
    
    var fromRadians = function(latitude, longitude) {
        var degLat = latitude * 180 / Math.PI, // degrees = radians * (180/pi)
        degLon = longitude * 180 / Math.PI; // degrees = radians * (180/pi)

        return [degLon, degLat];
    };
    
    var earthRadius = 6371.01;
    var radLat = toRadian(latitude);
    var radLon = toRadian(longitude);
    
    var MIN_LAT = toRadian(-90);  // -PI/2
    var MAX_LAT = toRadian(90);   //  PI/2
    var MIN_LON = toRadian(-180); // -PI
    var MAX_LON = toRadian(180);
    
    var radDist = radKm / earthRadius,
    minLat = radLat - radDist,
    maxLat = radLat + radDist,
    minLon,
    maxLon;

    if (minLat > MIN_LAT && maxLat < MAX_LAT) {
        var deltaLon = Math.asin(Math.sin(radDist) /
            Math.cos(radLat));
            minLon = radLon - deltaLon;
        if (minLon < MIN_LON) {
            minLon += 2 * Math.PI;
        }
        maxLon = radLon + deltaLon;
        if (maxLon > MAX_LON) {
            maxLon -= 2 * Math.PI;
        }
    }
    else {
        // a pole is within the distance
        minLat = Math.max(minLat, MIN_LAT);
        maxLat = Math.min(maxLat, MAX_LAT);
        minLon = MIN_LON;
        maxLon = MAX_LON;
    }
    
    var lowerLeft = fromRadians(minLat, minLon);
    var upperRight = fromRadians(maxLat, maxLon);
    
    return [lowerLeft[0], lowerLeft[1], upperRight[0], upperRight[1]].toString();
};

var isInBoundingBox = function(latitude, longitude, box) {
    // TODO: needs to be implemented (see npmjs.org for module on bbox)
    // Note: using the bounding box cuts down on using the haversine function on every location
    return true;
};

exports.boundingBox = getBoundingBox;
exports.isInBoundingBox = isInBoundingBox;

//// Loading Routines ////

var expirationPeriod = 60; // minutes to cache data
var filename = './data.json'; // where to store the data
var database;

var gatherDirections = function(routes) {
    return fetchRoutes().then(function(routes) {
        var promises = [];
        for (var i=0;i<routes.length;i++) {
            var route = routes[i];

            // assemble the directions for each route
            var promise = fetchDirections(route);
            promises.push(promise);
        }

        return waitForPromises(promises);
    });
};

var gatherStops = function(routes) {
    var promises = [];
    for (var i=0;i<routes.length;i++) {
        var route = routes[i];
        if (!route.directions) {
            return when.reject('Directions not defined for route');
        }
        else {
            for (var j=0;j<route.directions.length;j++) {
                var direction = route.directions[j];

                // assemble the stops for each route
                var promise = fetchStops(route, direction);
                promises.push(promise);
            }
        }
    }

    return waitForPromises(promises);
};

var organizeData = function(routes) {
    var routesHash = {};
    var stopsHash = {};
    for (var i=0;i<routes.length;i++) {
        if (routesHash[routes[i].id] === undefined) {
            routesHash[routes[i].id] = {
                'name' : routes[i].name,
                'color' : routes[i].color
            };
        }

        for (var j=0;j<routes[i].stops.length;j++) {
            var stop = routes[i].stops[j];
            if (stopsHash[stop.id] === undefined) {
                stopsHash[stop.id] = {
                    'name' : stop.name,
                    'latitude' : stop.latitude,
                    'longitude' : stop.longitude,
                    'routeId' : stop.routeId,
                    'direction' : stop.direction
                };
            }
        }
    }

    var lastUpdate = new Date().toISOString();
    var data = {'routes' : routesHash, 'stops' : stopsHash, 'lastUpdate' : lastUpdate};

    return data;
};

// gather the routes, directions and stops together
var gatherAllData = function() {
    if (baseUrl === '') {
        return when.reject('Base URL must be defined');
    }
    if (apiKey === '') {
        return when.reject('API Key must be defined');
    }

    return fetchRoutes().then(gatherDirections).then(gatherStops).then(function(routes) {
        return when.resolve(organizeData(routes));
    });
};

var loadFileData = function() {
    return when.promise(function(resolve, reject) {
        fs.exists(filename, function (exists) {
            if (exists) {
                fs.readFile(filename, function (err, filedata) {
                    if (!err) {
                        var data = JSON.parse(filedata);
                        var lastUpdate = Date.parse(data.lastUpdate);
                        if (isDateAfterMinutesAgo(lastUpdate, expirationPeriod)) {
                            database = data;
                            resolve(data);
                        }
                        else {
                            resolve(null);
                        }
                    }
                    else {
                        resolve(null);
                    }
                });
            }
            else {
                resolve(null);
            }
        });
    });
};

var isDataCurrent = function() {
    var lastUpdate = database !== undefined ? Date.parse(database.lastUpdate) : null;
    return lastUpdate && isDateAfterMinutesAgo(lastUpdate, expirationPeriod);
};

var hasStops = function() {
    return database !== undefined && database.stops !== undefined && database.stops.length !== undefined;
};

var isLoadingData;

var loadData = function() {
    if (isDataCurrent()) {
        return when.resolve(database);
    }
    
    if (isLoadingData) {
        return when.reject("Data is already loading");
    }
    
    isLoadingData = true;

    return loadFileData().then(function(data) {
        if (data) {
            isLoadingData = false;
            return when.resolve(data);
        }
        else {
            return gatherAllData().then(function(data) {
                // write the data out to a file to reuse while the data is still fresh (lastUpdated)
                fs.writeFile(filename, JSON.stringify(data, null, 4), function(error) {
                    if (error) {
                        console.log('Error writing out JSON data: ' + error);
                    }
                });
                isLoadingData = false;
                return when.resolve(data);
            });
        }
    });
};

exports.isDataCurrent = isDataCurrent;
exports.loadData = loadData;

var lookupStops = function(latitude, longitude, radius) {
    var box = getBoundingBox(latitude, longitude, radius);
    var location = { latitude: latitude, longitude: longitude };
    var matches = [];
    
    var keys = Object.keys(database.stops);
    for (var s=0;s<keys.length;s++) {
        var stop = database.stops[keys[s]];
        if (isInBoundingBox(stop.latitude, stop.longitude, box)) {
            var distance = haversine(location, stop);
            // Note: distance is kilometers
            if (distance < radius) {
                // do not modify source data
                var copy = stop;
                copy.stopId = keys[s];
                matches.push(stop);
            }
        }
    }
    
    return when.resolve(matches);
};

exports.lookupStops = lookupStops;
