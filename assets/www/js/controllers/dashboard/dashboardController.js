'use strict';

app.controller('dashboardController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log','$rootScope', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope) {
    var allPanels = [];

    $scope.selected = null;
    $scope.panels = allPanels;
    $scope.selectPanel = selectPanel;
    $scope.toggleSidenav = toggleSidenav;

    loadPanels();
    $scope.getTemplate = function(item) {
        switch (item) {
            case "Home":
                return 'www/js/templates/home/home.html';
            case "Employees":
                return 'www/js/templates/employees/employee.html';
            case "Locations":
                return 'www/js/templates/location/location.html';
            case "Sections":
                return 'www/js/templates/sections/sections.html';
            case "Tables":
                return 'www/js/templates/tables/tables.html';
            case "Orders":
                return 'www/js/templates/orders/orders.html';
            case "Inventory":
                return 'www/js/templates/inventory/inventory.html';
            default:
                return 'www/js/templates/home/home.html';
        }
    }
    function loadPanels() {
        panelService.loadAll()
            .then(function(panels) {
                allPanels = panels;
                $scope.panels = [].concat(panels);
                $scope.selected = $scope.panels[0];
            })
    }

    function toggleSidenav(name) {
        $mdSidenav(name).toggle();
    }

    function selectPanel(panel) {
        $scope.selected = angular.isNumber(panel) ? $scope.panels[panel] : panel;
        $scope.toggleSidenav('left');
    }
}]);


app.service('panelService', ['$q', function($q) {
    var panels = [{
        name: 'Home'
    },{
        name:'Employees'
    },{
        name:'Locations'
    },{
        name:'Sections'
    },{
        name:'Tables'
    },{
        name:'Orders'
    },{
        name:'Inventory'
    }];
    return {
        loadAll: function() {
            return $q.when(panels);
        }
    };
}]);