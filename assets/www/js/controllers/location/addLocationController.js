'use strict';

app.controller('addLocationController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'locationDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, locationDataService, $route, $location) {
    $scope.successMessage = "";
    $scope.formClear = function() {
        $scope.inputLocation = "";
    };

    $scope.saveDataLocation = function() {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined) {
            var locationInfo = [{
                "locationName": $scope.inputLocation,
                "sections": "",
                "orderId": ""
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                locationDataService.addNewLocation(locationInfo,$rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessage = responseData.msg;
                    $timeout(function() {
                        $scope.successMessage = "";
                        $rootScope.showLocationForm = false;
                        $route.reload();
                    }, 3000);
                });
            } else {
                $location.path("/login");
            }
        }
    };
}]);