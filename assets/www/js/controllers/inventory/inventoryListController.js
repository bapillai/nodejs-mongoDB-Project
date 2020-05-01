app.controller('inventoryListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'inventoryDataService', 'locationDataService', 'sectionDataService', '$location', 'filteredListService', '$filter', function($resource, $http, $q, $scope, $interval, $rootScope, $timeout, inventoryDataService, locationDataService, sectionDataService, $location, filteredListService, $filter) {
    $rootScope.showSectionForm = false;
    getLocationList();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";
    $scope.selectedLocationIdInvList = "";
    $scope.selectedLocationNameInvList = "";
    $scope.selectedSectionIdInvList = "";
    $scope.selectedSectionNameInvList = "";
    $scope.sectionListForInventoryTable = [];
    $scope.locationListForInventoryTable = [];

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocationForList != null && $scope.inputLocationForList != undefined && $scope.inputLocationForList != "") {
            var locationIdSelected = $scope.inputLocationForList;
            var locationSelected = $.grep($scope.locationListForInventoryTable, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdInvList = locationSelected[0].locationId;
            $scope.selectedLocationNameInvList = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdInvList', function() {
        if ($scope.selectedLocationIdInvList != undefined && $scope.selectedLocationIdInvList != "") {
            var selectedLocationIdInvList = $scope.selectedLocationIdInvList;
            $scope.getSectionList(selectedLocationIdInvList);
        }
    });
    $scope.getSectionSelected = function(section) {
        if ($scope.inputSectionForList != null && $scope.inputSectionForList != undefined && $scope.inputSectionForList != "") {
            var sectionIdSelected = $scope.inputSectionForList;
            var sectionSelected = $.grep($scope.sectionListForInventoryTable, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdInvList = sectionSelected[0].sectionId;
            $scope.selectedSectionNameInvList = sectionSelected[0].sectionName;
        }
    };
    $scope.$watch('selectedSectionIdInvList', function() {
        if ($scope.selectedSectionIdInvList != undefined && $scope.selectedSectionIdInvList != "") {
            var selectedSectionIdInvList = $scope.selectedSectionIdInvList;
            loadTableData();
        }
    });

    function getLocationList() {
        $scope.allItems = [];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                for (var i = 0; i < responseData.location.length; i++) {
                    $scope.locationListForInventoryTable.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationIdInvList) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdInvList != "" && selectedLocationIdInvList != null && selectedLocationIdInvList != undefined) {
            sectionDataService.getASection($rootScope.token, selectedLocationIdInvList).then(function(responseData) {
                $scope.sectionListForInventoryTable = [];
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionListForInventoryTable.push({
                        sectionName: responseData.section[i].sectionName,
                        sectionId: responseData.section[i].sectionId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };

    function loadTableData() {
         $scope.allItems = [];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            inventoryDataService.getAllInventory($scope.selectedLocationIdInvList, $scope.selectedSectionIdInvList, $rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("inventoryId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        $scope.allItems = [];
        for (var i = 0; i < responseData.invent.length; i++) {
            $scope.allItems.push(responseData.invent[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            inventoryDataService.editAnInventory($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.inventoryId === responseData.editedInventory.inventoryId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedInventory);
                        $scope.resetAll();
                        $scope.sort("inventoryId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            inventoryDataService.deleteInventory(item.sectionId, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.inventoryId === responseData.deletedinventoryId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("inventoryId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule = "Inventory";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText, $scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "inventoryId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "inventoryName") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "price") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "quantity") {
            $scope.Header[3] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[4] = iconName;
        } else {
            $scope.Header[5] = iconName;
        }
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilInventory(item, toSearch) {
    return (item.inventoryId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.inventoryName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.price.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.quantity.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}