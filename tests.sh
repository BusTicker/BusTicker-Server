#!/bin/sh

# Replace API-KEY with actual API key. Get your own developer key at the link below.
# http://realtime.ridemcts.com/bustime/newDeveloper.jsp

node tests.js --provider=mcts --apikey=API-KEY --baseurl="http://realtime.ridemcts.com/bustime/api/v2/"

# debug with node-inspector (set Chrome as default browser)
# npm install node-inspector -g
# node-debug tests.js --provider=mcts --apikey=API-KEY --baseurl="http://realtime.ridemcts.com/bustime/api/v2/"

