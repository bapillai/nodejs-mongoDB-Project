'use strict';

app.controller('addOrderController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'orderDataService', 'locationDataService', 'sectionDataService', 'tableDataService', 'employeeDataService', 'inventoryDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, orderDataService, locationDataService, sectionDataService, tableDataService, employeeDataService, inventoryDataService, $route, $location) {
    $scope.successMessageOrder = "";
    $scope.locationListForOrder = [];
    $scope.employeeListForOrder = [];
    $scope.sectionListForOrder = [];
    $scope.tableListForOrder = [];
    $scope.inventoryListForOrder = [];
    $scope.selectedSection = "";
    $scope.selectedLocationIdOrd = "";
    $scope.selectedLocationNameOrd = "";
    $scope.selectedSectionIdOrd = "";
    $scope.selectedSectionNameOrd = "";

    $scope.formClear = function() {
        $scope.inputLocationOrder = "";
        $scope.inputEmployeeOrder = "";
        $scope.inputSectionOrder = "";
        $scope.inputTableOrder = "";
        $scope.inputInventoryOrder = "";
        $scope.orderDesc = "";
    };
    $scope.getLocationSelectedOrder = function(location) {
        if ($scope.inputLocationOrder != null && $scope.inputLocationOrder != undefined && $scope.inputLocationOrder != "") {
            var locationIdSelected = $scope.inputLocationOrder;
            var locationSelected = $.grep($scope.locationListForOrder, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdOrd = locationSelected[0].locationId;
            $scope.selectedLocationNameOrd = locationSelected[0].locationName;
        }
    };
    $scope.getEmployeeSelectedOrder = function(employee) {
        if ($scope.inputEmployeeOrder != null && $scope.inputEmployeeOrder != undefined && $scope.inputEmployeeOrder != "") {
            var employeeIdSelected = $scope.inputEmployeeOrder;
            var employeeSelected = $.grep($scope.employeeListForOrder, function(employee) {
                return employee.employeeId == employeeIdSelected;
            });
            $scope.selectedEmployeeIdOrd = employeeSelected[0].employeeId;
            $scope.selectedEmployeeNameOrd = employeeSelected[0].name;
        }
    };
    $scope.getSectionSelectedOrder = function(section) {
        if ($scope.inputSectionOrder != null && $scope.inputSectionOrder != undefined && $scope.inputSectionOrder != "") {
            var sectionIdSelected = $scope.inputSectionOrder;
            var sectionSelected = $.grep($scope.sectionListForOrder, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdOrd = sectionSelected[0].sectionId;
            $scope.selectedSectionNameOrd = sectionSelected[0].sectionName;
        }
    };
    $scope.getTableSelectedOrder = function(table) {
        if ($scope.inputTableOrder != null && $scope.inputTableOrder != undefined && $scope.inputTableOrder != "") {
            var tableIdSelected = $scope.inputTableOrder;
            var tableSelected = $.grep($scope.tableListForOrder, function(table) {
                return table.tableId == tableIdSelected;
            });
            $scope.selectedTableIdOrd = tableSelected[0].tableId;
            $scope.selectedTableNameOrd = tableSelected[0].tableName;
        }
    };
    $scope.getInventorySelectedOrder = function(inventory) {
        if ($scope.inputInventoryOrder != null && $scope.inputInventoryOrder != undefined && $scope.inputInventoryOrder != "") {
            var inventoryIdSelected = $scope.inputInventoryOrder;
            var inventorySelected = $.grep($scope.inventoryListForOrder, function(inventory) {
                return inventory.inventoryId == inventoryIdSelected;
            });
            $scope.selectedInventoryIdOrd = inventorySelected[0].inventoryId;
            $scope.selectedInventoryNameOrd = inventorySelected[0].inventoryName;
        }
    };
    $scope.$watch('selectedLocationIdOrd', function() {
        if ($scope.selectedLocationIdOrd != undefined && $scope.selectedLocationIdOrd != "") {
            var selectedLocationIdOrd = $scope.selectedLocationIdOrd;
            $scope.getSectionList(selectedLocationIdOrd);
            $scope.getEmployeeList(selectedLocationIdOrd);
        }
    });
    $scope.$watch('selectedSectionIdOrd', function() {
        if ($scope.selectedSectionIdOrd != undefined && $scope.selectedSectionIdOrd != "") {
            var selectedSectionIdOrd = $scope.selectedSectionIdOrd;
            $scope.getTableList(selectedSectionIdOrd);
            $scope.getInventoryList($scope.selectedLocationIdOrd, $scope.selectedSectionIdOrd);
        }
    });
    $scope.saveOrderForm = function() {
        if ($scope.selectedLocationIdOrd != null && $scope.selectedLocationIdOrd != undefined && $scope.selectedLocationNameOrd != null && $scope.selectedLocationNameOrd != undefined && $scope.selectedSectionIdOrd != null && $scope.selectedSectionNameOrd != undefined && $scope.selectedSectionIdOrd != null && $scope.selectedSectionIdOrd != undefined && $scope.selectedSectionNameOrd != null && $scope.selectedSectionNameOrd != undefined && $scope.selectedEmployeeIdOrd !=null && $scope.selectedEmployeeIdOrd != undefined && $scope.selectedEmployeeNameOrd !=null && $scope.selectedEmployeeNameOrd !=undefined && $scope.selectedTableIdOrd !=null && $scope.selectedTableIdOrd !=undefined && $scope.selectedTableNameOrd !=null && $scope.selectedTableNameOrd !=undefined && $scope.selectedInventoryIdOrd !=null && $scope.selectedInventoryIdOrd !=undefined && $scope.selectedInventoryNameOrd !=null && $scope.selectedInventoryNameOrd !=undefined) {
            var orderInfo = [{
                "locationId": $scope.selectedLocationIdOrd,
                "locationName": $scope.selectedLocationNameOrd,
                "sectionId": $scope.selectedSectionIdOrd,
                "sectionName": $scope.selectedSectionNameOrd,
                "tableName": $scope.selectedTableNameOrd,
                "tableId": $scope.selectedTableIdOrd,
                "employeeId":$scope.selectedEmployeeIdOrd,
                "name":$scope.selectedEmployeeNameOrd,
                "orderDesc":$scope.orderDesc,
                "inventoryItems":[{"inventoryId":$scope.selectedInventoryIdOrd,"inventoryName":$scope.selectedInventoryNameOrd}]
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                orderDataService.addNewOrder(orderInfo, $rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessageOrder = responseData.msg;
                    $timeout(function() {
                        $scope.successMessageOrder = "";
                        $rootScope.showOrderForm = false;
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
                    $scope.locationListForOrder.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getEmployeeList = function(selectedLocationIdOrd) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdOrd != "" && selectedLocationIdOrd != null && selectedLocationIdOrd != undefined) {
            employeeDataService.getAnEmployee($rootScope.token, selectedLocationIdOrd).then(function(responseData) {
                $scope.employeeListForOrder = [];
                for (var i = 0; i < responseData.employees.length; i++) {
                    $scope.employeeListForOrder.push({
                        name: responseData.employees[i].name,
                        employeeId: responseData.employees[i].employeeId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationIdOrd) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdOrd != "" && selectedLocationIdOrd != null && selectedLocationIdOrd != undefined) {
            sectionDataService.getASection($rootScope.token, selectedLocationIdOrd).then(function(responseData) {
                $scope.sectionListForOrder = [];
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionListForOrder.push({
                        sectionName: responseData.section[i].sectionName,
                        sectionId: responseData.section[i].sectionId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getInventoryList = function(selectedLocationIdOrd, selectedSectionIdOrd) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdOrd != "" && selectedLocationIdOrd != null && selectedLocationIdOrd != undefined && selectedSectionIdOrd != null && selectedSectionIdOrd != "" && selectedSectionIdOrd != undefined) {
            inventoryDataService.getAllInventory(selectedLocationIdOrd, selectedSectionIdOrd, $rootScope.token).then(function(responseData) {
                $scope.inventoryListForOrder = [];
                for (var i = 0; i < responseData.invent.length; i++) {
                    $scope.inventoryListForOrder.push({
                        inventoryName: responseData.invent[i].inventoryName,
                        inventoryId: responseData.invent[i].inventoryId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getTableList = function(selectedSectionIdOrd) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedSectionIdOrd != null && selectedSectionIdOrd != "" && selectedSectionIdOrd != undefined) {
            tableDataService.getATable($rootScope.token, selectedSectionIdOrd).then(function(responseData) {
                for (var i = 0; i < responseData.table.length; i++) {
                    $scope.tableListForOrder.push({
                        tableName: responseData.table[i].tableName,
                        tableId: responseData.table[i].tableId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getLocationList();
}]);