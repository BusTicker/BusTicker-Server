BusTickr-Server
===============

Run with `node app.js -dev` to use dummy output.

RideMCTS Real-time API Examples
===============================

Replace API-KEY with actual API key. Get your own developer key at the link below.

http://realtime.ridemcts.com/bustime/newDeveloper.jsp

The following API calls are used to fetch routes, directions, bus stops and then predictions.

Fetch the routes first.

http://realtime.ridemcts.com/bustime/api/v2/getroutes?key=API-KEY&format=json

Then fetch directions for each route using rt.

http://realtime.ridemcts.com/bustime/api/v2/getdirections?key=API-KEY&format=json&rt=GRE

With route and direction fetch bus stops using rt and dir.

http://realtime.ridemcts.com/bustime/api/v2/getstops?key=API-KEY&format=json&rt=GRE&dir=SOUTH

For a bus stop fetch predictions using rt, dir and stpid.

http://realtime.ridemcts.com/bustime/api/v2/getpredictions?key=API-KEY&format=json&rt=GRE&dir=SOUTH&stpid=1417

Predictions includes an array of predictions whic includes tmpstmp and prdctdn which is the timestamp (YYYYMMDD HH:MM) of the time the prediction was generated and prdctdn is the number of minutes until the bus will arrive at that stop.

The timestamp and each prediction in minutes can be combined to create an ISO date/time value which can use standard date/time logic on a native platform to determine the time between now and when the bus is expected to arrive at a stop.
