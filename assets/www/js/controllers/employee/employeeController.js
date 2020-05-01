'use strict';

app.controller('employeeController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'employeeDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, employeeDataService) {
    $rootScope.showEmployeeForm =false;
    $scope.successMessage = "";
    $scope.showAddEmployeeForm = function(){
        $rootScope.showEmployeeForm =true;
    };
}]);
