
var getSubset = function(items, page, pageSize) {
    var startIndex = (page * pageSize) - pageSize;
    var endIndex = Math.min(startIndex + pageSize, items.length);

    if (startIndex > endIndex) {
        return [];
    }

    var subset = items.slice(startIndex, endIndex);
    
    return subset;
};

exports.getSubset = getSubset;
