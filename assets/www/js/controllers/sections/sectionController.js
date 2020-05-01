'use strict';

app.controller('sectionController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService) {
    $rootScope.showSectionForm =false;
    $scope.successMessageSection = "";
    $scope.showAddSectionForm = function(){
        $rootScope.showSectionForm =true;
    };
}]);
