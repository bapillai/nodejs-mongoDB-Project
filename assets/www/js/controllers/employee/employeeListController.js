app.controller('employeeListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'employeeDataService', '$location', 'filteredListService', '$filter', function($resource, $http, $q, $scope, $interval, $rootScope, $timeout, employeeDataService, $location, filteredListService, $filter) {
    $rootScope.showEmployeeForm = false;
    loadTableData();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";

    function loadTableData() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            employeeDataService.getAllEmployees($rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("employeeId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.employees.length; i++) {
            $scope.allItems.push(responseData.employees[i]);
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
            employeeDataService.editEmployee($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.employeeId === responseData.editedEmployee.employeeId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedEmployee);
                        $scope.resetAll();
                        $scope.sort("employeeId");
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
            employeeDataService.removeEmployee(item.employeeId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.employeeId === responseData.deletedemployeeId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("employeeId");
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
        $scope.searchModule="Employee";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText,$scope.searchModule);
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
        if (sortBy === "employeeId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "name") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "phoneNumber") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "email") {
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

function searchUtilEmployee(item, toSearch) {
    return (item.employeeId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.phoneNumber.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.email.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.role.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}