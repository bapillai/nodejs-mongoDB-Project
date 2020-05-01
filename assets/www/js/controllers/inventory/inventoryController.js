'use strict';

app.controller('inventoryController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'inventoryDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, inventoryDataService) {
    $rootScope.showInventoryForm =false;
    $scope.successMessageInventory = "";
    $scope.showAddInventoryForm = function(){
        $rootScope.showInventoryForm =true;
    };
}]);
