
// Converter to adjust MCTS API dates to a more standard format. We should use a library for this soon though.
//exports.toDate = function(timeStr) {
//    var time = new Date(timeStr.substring(0, 4) + "-" + timeStr.substring(4, 6) + "-" + timeStr.substring(6, 8) + " " + timeStr.substring(10, 15));
//    return Date.parse(time);
//};

//exports.parseETA = function(timestamp) {
//    // timestamp : "20140927 14:30"
//    if (timestamp.length === 14) {
//        var year = parseInt(timestamp.substring(0, 4), 10);
//        var month = parseInt(timestamp.substring(4, 6), 10);
//        var day = parseInt(timestamp.substring(6, 8), 10);
//        var hour = parseInt(timestamp.substring(9, 11), 10);
//        var minute = parseInt(timestamp.substring(12, 14), 10);
//
//        return new Date(year, month - 1, day, hour, minute, 0, 0);
//    }
//    else {
//        return null;
//    }
//};
