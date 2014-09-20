// this is just a messy script to manipulate the json data for the stops
// later we'll refactor this into the auto-update script for the stop cache

var http = require("http");
var route_blob = require(__dirname+"/sample data/getroutes_response.json");
var all_rt_dirs = require(__dirname+"/sample data/rt_dir_combos.json")

/*
var routes = route_blob["bustime-response"].routes;
var responseCount = 0;
var rtDirArray = [];
routes.forEach(function (route, index, array) {
  var obj = {};
  //console.log(route.rt);
  http.get("http://realtime.ridemcts.com/bustime/api/v2/getdirections?key=##TAYLORSKEY##&format=json&rt="+route.rt, function(res) {
    //console.log("Got response: " + res.statusCode);
    res.setEncoding("utf8");
    res.on('data', function(chunk) {
      responseCount ++;
      var dir_array = JSON.parse(chunk)["bustime-response"].directions;
      for(i=0;i<dir_array.length;i++) {
        obj = {};
        dirstring = dir_array[i].dir;
        obj.rt = route.rt;
        obj.dir = dirstring;
        rtDirArray.push(obj);
        console.log(obj);
      }
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

});
*/


var routes = all_rt_dirs.rt_dir_array;
var stopsArray = {};
var responsesReceived = 0;
routes.forEach(function (route, index, array) {
  var stop = {};
  http.get("http://realtime.ridemcts.com/bustime/api/v2/getstops?key=##TAYLORSKEY##&format=json&rt="+route.rt+"&dir="+route.dir, function(res) {
    //console.log("Got response: " + res.statusCode);
    res.setEncoding("utf8");
    res.on('data', function(chunk) {
      data = JSON.parse(chunk)["bustime-response"].stops;
      for(i = 0; i<data.length; i++) {
        if(stopsArray[data[i].stpid] != null) {
          //console.log("Found duplicate stop: "+data[i].stpid);
        } else {
          data[i].rt = route.rt;
          data[i].dir = route.dir;
          data[i].routedir = route.rt + route.dir;
          stopsArray[data[i].stpid] = data[i];
          console.log(data[i])
        }
      }
      responsesReceived ++;
      if (responsesReceived % 1 == 0) {
        //console.log("Rec'd "+responsesReceived+" responses.");
      }
      if (responsesReceived == 70) {
        //console.log("Done?"); // probably done
      }
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

});




