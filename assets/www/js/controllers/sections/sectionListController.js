app.controller('sectionListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'sectionDataService','$location','filteredListService', '$filter', function ($resource, $http, $q, $scope,  $interval, $rootScope, $timeout, sectionDataService,$location,filteredListService, $filter) {
    $rootScope.showSectionForm = false;
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
            sectionDataService.getAllSection($rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("sectionId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.section.length; i++) {
            $scope.allItems.push(responseData.section[i]);
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
            sectionDataService.editSection($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.sectionId === responseData.editedSection.sectionId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedSection);
                        $scope.resetAll();
                        $scope.sort("sectionId");
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
            sectionDataService.removeSection(item.sectionId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.sectionId === responseData.deletedsectionId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("sectionId");
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
        $scope.searchModule="Section";
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
        if (sortBy === "sectionId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "locationId") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "sectionName") {
            $scope.Header[3] = iconName;
        } else {
            $scope.Header[4] = iconName;
        } 
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilSection(item, toSearch) {
    return (item.sectionId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}