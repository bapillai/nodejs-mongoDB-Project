app.service('filteredListService', function() {
    this.searched = function(valLists, toSearch, searchModule) {
        if (searchModule == "Employee") {
            return _.filter(valLists, function(i) {
                return searchUtilEmployee(i, toSearch);
            });
        }else if(searchModule =="Location"){
             return _.filter(valLists, function(i) {
                return searchUtilLocation(i, toSearch);
            });
        }
        else if(searchModule =="Section"){
             return _.filter(valLists, function(i) {
                return searchUtilSection(i, toSearch);
            });
        }else if(searchModule =="Tables"){
             return _.filter(valLists, function(i) {
                return searchUtilTables(i, toSearch);
            });
        }else if(searchModule =="Orders"){
             return _.filter(valLists, function(i) {
                return searchUtilOrder(i, toSearch);
            });
        }else{
            return _.filter(valLists, function(i) {
                return searchUtilInventory(i, toSearch);
            });
        }
    };
    this.paged = function(valLists, pageSize) {
        var retVal = [];
        for (var i = 0; i < valLists.length; i++) {
            if (i % pageSize === 0) {
                retVal[Math.floor(i / pageSize)] = [valLists[i]];
            } else {
                retVal[Math.floor(i / pageSize)].push(valLists[i]);
            }
        }
        return retVal;
    };
});