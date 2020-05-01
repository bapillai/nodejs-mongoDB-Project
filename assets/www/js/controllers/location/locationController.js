'use strict';

app.controller('locationController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'locationDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, locationDataService) {
    $rootScope.showLocationForm =false;
    $scope.successMessage = "";
    $scope.showAddLocationForm = function(){
        $rootScope.showLocationForm =true;
    };
}]);
