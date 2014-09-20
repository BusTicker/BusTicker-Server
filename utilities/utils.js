var utilities = {};

// Converter to adjust MCTS API dates to a more stnadard format. We should use a library for this soon though.
utilities.to8601 = function (timeStr) {
  var time = new Date(timeStr.substring(0,4) + "-" + timeStr.substring(4,6) + "-" + timeStr.substring(6,8) + " " + timeStr.substring(10,15));
  return Date.parse(time);
}

module.exports = utilities;