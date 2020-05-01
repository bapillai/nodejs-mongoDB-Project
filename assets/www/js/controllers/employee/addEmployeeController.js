'use strict';

app.controller('addEmployeeController', ['$scope', '$mdSidenav', 'panelService', '$route', '$timeout', '$log', '$rootScope', 'employeeDataService', 'locationDataService', 'sectionDataService', '$location', function($scope, $mdSidenav, panelService, $route, $timeout, $log, $rootScope, employeeDataService, locationDataService, sectionDataService, $location) {
    $scope.successMessage = "";
    $scope.locationListForEmployee = [];
    $scope.sectionListForEmployee = [];
    $scope.selectedLocationIdEmp = "";
    $scope.selectedLocationNameEmp = "";
    $scope.formClear = function() {
        $scope.inputName = "";
        $scope.inputPhone = "";
        $scope.inputEmail = "";
        $scope.inputLocation = "";
        $scope.inputSection = "";
        $scope.selectedRole = "";
        $scope.inputRestaurant = "";
    };
    $scope.getLocationSelected = function(location) {
        if (location!= null && location != undefined && location != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForEmployee, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdEmp = locationSelected[0].locationId;
            $scope.selectedLocationNameEmp = locationSelected[0].locationName;
        }
    };
    
    $scope.$watch('selectedLocationIdEmp', function() {
        if($scope.selectedLocationIdEmp != undefined && $scope.selectedLocationIdEmp !=""){
            var selectedLocationIdEmp = $scope.selectedLocationIdEmp;
            $scope.getSectionList(selectedLocationIdEmp);  
        }
    });
    $scope.getLocationList = function() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                for (var i = 0; i < responseData.location.length; i++) {
                    $scope.locationListForEmployee.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
   $scope.getSectionList = function(selectedLocationIdEmp) {
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdEmp !=null && selectedLocationIdEmp != undefined && selectedLocationIdEmp !="") {
                sectionDataService.getASection($rootScope.token,selectedLocationIdEmp).then(function(responseData) {
                    $scope.sectionListForEmployee = [];
                    for (var i = 0; i < responseData.section.length; i++) {
                        $scope.sectionListForEmployee.push({
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
    $scope.saveData = function() {
        var employeeInfo = [{
            "name": $scope.inputName,
            "phoneNumber": $scope.inputPhone,
            "email": $scope.inputEmail,
            "locationId": $scope.selectedLocationIdEmp,
            "locationName": $scope.selectedLocationNameEmp,
            "sectionName": $scope.inputSection,
            "role": $scope.selectedRole
        }];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            employeeDataService.addNewEmployee(employeeInfo,$rootScope.token).then(function(responseData) {
                $scope.formClear();
                $scope.successMessage = responseData.msg;
                $timeout(function() {
                    $scope.successMessage = "";
                    $rootScope.showEmployeeForm = false;
                    $route.reload();
                }, 3000);
            });
        } else {
            $location.path("/login");
        }
    };
}]);