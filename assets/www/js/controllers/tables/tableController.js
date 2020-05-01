'use strict';

app.controller('tableController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'tableDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, tableDataService) {
    $rootScope.showTableForm =false;
    $scope.successMessageTable = "";
    $scope.showAddTableForm = function(){
        $rootScope.showTableForm =true;
    };
}]);
