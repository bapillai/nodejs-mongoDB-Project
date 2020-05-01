'use strict';

app.controller('addSectionController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', 'locationDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService, locationDataService, $route, $location) {
    $scope.successMessageSection = "";
    $scope.locationListForSection = [];
    $scope.sectionList = [];
    $scope.selectedTable = "";
    $scope.selectedLocationId = "";
    $scope.selectedLocationName = "";
    $scope.formClear = function() {
        $scope.inputLocation = "";
        $scope.selectedSection = "";
    };

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForSection, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationId = locationSelected[0].locationId;
            $scope.selectedLocationName = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationId', function() {
        if ($scope.selectedLocationId != undefined && $scope.selectedLocationId != "") {
            var selectedLocationId = $scope.selectedLocationId;
            $scope.getSectionList(selectedLocationId);
        }
    });
    $scope.saveSectionForm = function() {
        if ($scope.selectedLocationId != undefined && $scope.selectedLocationId != null && $scope.selectedLocationName != undefined && $scope.selectedLocationName != null && $scope.selectedSection != null && $scope.selectedSection != undefined) {
            var sectionInfo = [{
                "locationId": $scope.selectedLocationId,
                "locationName": $scope.selectedLocationName,
                "sectionName": $scope.selectedSection,
                "tableName": ""
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                sectionDataService.addNewSection(sectionInfo, $rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessageSection = responseData.msg;
                    $timeout(function() {
                        $scope.successMessageSection = "";
                        $rootScope.showTableForm = false;
                        $route.reload();
                    }, 3000);
                });
            } else {
                $location.path("/login");
            }
        }
    };
    $scope.getLocationList = function() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                for (var i = 0; i < responseData.location.length; i++) {
                    $scope.locationListForSection.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationId) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationId != null && selectedLocationId != undefined && selectedLocationId != "") {
            sectionDataService.getASection($rootScope.token, selectedLocationId).then(function(responseData) {
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionList.push(responseData.section[i].sectionName);
                }

            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getLocationList();
}]);