'use strict';

app.controller('orderController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'orderDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, orderDataService) {
    $rootScope.showOrderForm =false;
    $scope.successMessageOrder = "";
    $scope.showAddOrderForm = function(){
        $rootScope.showOrderForm =true;
    };
}]);
