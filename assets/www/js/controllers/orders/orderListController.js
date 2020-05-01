app.controller('orderListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'orderDataService','locationDataService','$location','filteredListService', '$filter', function ($resource, $http, $q, $scope,  $interval, $rootScope, $timeout, orderDataService,locationDataService,$location,filteredListService, $filter) {
    $rootScope.showSectionForm = false;
    getLocationList();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";
    $scope.selectedLocationIdOrdList = "";
    $scope.selectedLocationNameOrdList = "";
    $scope.locationListForOrderTable = [];

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocationForList != null && $scope.inputLocationForList != undefined && $scope.inputLocationForList != "") {
            var locationIdSelected = $scope.inputLocationForList;
            var locationSelected = $.grep($scope.locationListForOrderTable, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdOrdList = locationSelected[0].locationId;
            $scope.selectedLocationNameOrdList = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdOrdList', function() {
        if ($scope.selectedLocationIdOrdList != undefined && $scope.selectedLocationIdOrdList != "") {
            var selectedLocationIdOrdList = $scope.selectedLocationIdOrdList;
            loadTableData(selectedLocationIdOrdList);
        }
    });
    function getLocationList() {
        $scope.allItems = [];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                for (var i = 0; i < responseData.location.length; i++) {
                    $scope.locationListForOrderTable.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };

    function loadTableData(selectedLocationIdInvList) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            orderDataService.getAllOrders(selectedLocationIdInvList,$rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("orderId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.order.length; i++) {
            $scope.allItems.push(responseData.order[i]);
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
            orderDataService.editAnOrder($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.orderId === responseData.editedOrder.orderId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedOrder);
                        $scope.resetAll();
                        $scope.sort("orderId");
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
            orderDataService.deleteOrder(item.orderId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.orderId === responseData.deletedId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("orderId");
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
        $scope.searchModule="Orders";
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
        if (sortBy === "orderId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "employeeId") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "tableId") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "locationId") {
            $scope.Header[3] = iconName;
        } else {
            $scope.Header[4] = iconName;
        } 
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilOrder(item, toSearch) {
    return (item.orderId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.employeeId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.tableId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}