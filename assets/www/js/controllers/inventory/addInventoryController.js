'use strict';

app.controller('addInventoryController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'inventoryDataService','locationDataService','sectionDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, inventoryDataService,locationDataService,sectionDataService, $route, $location) {
    $scope.successMessageInventory = "";
    $scope.locationListForInventory = [];
    $scope.sectionListForInventory = [];
    $scope.tableList = [];
    $scope.selectedSection = "";
    $scope.selectedLocationIdInv = "";
    $scope.selectedLocationNameInv = "";
    $scope.selectedSectionIdInv = "";
    $scope.selectedSectionNameInv = "";

    $scope.formClear = function() {
        $scope.inputLocation = "";
        $scope.inputSection = "";
    };
    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForInventory, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdInv = locationSelected[0].locationId;
            $scope.selectedLocationNameInv = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdInv', function() {
        if ($scope.selectedLocationIdInv != undefined && $scope.selectedLocationIdInv != "") {
            var selectedLocationIdInv = $scope.selectedLocationIdInv;
            $scope.getSectionList(selectedLocationIdInv);
        }
    });
    $scope.getSectionSelected = function(section) {
        if ($scope.inputSection != null && $scope.inputSection != undefined && $scope.inputSection != "") {
            var sectionIdSelected = $scope.inputSection;
            var sectionSelected = $.grep($scope.sectionListForInventory, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdInv = sectionSelected[0].sectionId;
            $scope.selectedSectionNameInv = sectionSelected[0].sectionName;
        }
    };
    
    $scope.saveInventoryForm = function() {
        if ($scope.selectedLocationIdInv != null && $scope.selectedLocationIdInv != undefined && $scope.selectedLocationNameInv != null && $scope.selectedLocationNameInv != undefined && $scope.selectedSectionIdInv != null && $scope.selectedSectionIdInv != undefined && $scope.selectedSectionIdInv != null && $scope.selectedSectionIdInv != undefined && $scope.selectedSectionNameInv != null && $scope.selectedSectionNameInv != undefined) {
            var inventoryInfo = [{
                "locationId": $scope.selectedLocationIdInv,
                "locationName":$scope.selectedLocationNameInv,
                "sectionId": $scope.selectedSectionIdInv,
                "sectionName": $scope.selectedSectionNameInv,
                "inventoryName": $scope.inventoryName,
                "price": $scope.price,
                "quantity": $scope.quantity
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                inventoryDataService.addNewInventory(inventoryInfo, $rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessageInventory = responseData.msg;
                    $timeout(function() {
                        $scope.successMessageInventory = "";
                        $rootScope.showInventoryForm = false;
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
                    $scope.locationListForInventory.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationIdTab) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdTab != "" && selectedLocationIdTab != null && selectedLocationIdTab != undefined) {
            sectionDataService.getASection($rootScope.token, selectedLocationIdTab).then(function(responseData) {
                $scope.sectionListForInventory = [];
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionListForInventory.push({
                        sectionName: responseData.section[i].sectionName,
                        sectionId: responseData.section[i].sectionId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getLocationList();
}]);