'use strict';

var app = angular.module('app', ['ngRoute','ngMaterial', 'ngResource','ui.bootstrap.modal']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider,
    $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'www/js/templates/login/login.html',
        controller: 'loginController'
      })
     .when('/signUp', {
        templateUrl: 'www/js/templates/login/signUp.html',
        controller: 'signUpController'
      })
      .when('/dashboard', {
        templateUrl: 'www/js/templates/dashboard/dashboard.html',
        controller: 'dashboardController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
/* Attaching new file */app.controller('headerController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
        $scope.loginName = $rootScope.userName ;  
        $scope.logOut = function(){
            $rootScope.token = "";
             $location.path("/login");
        };
}]);/* Attaching new file */'use strict';
app.controller('loginController', ['$scope', '$location', '$rootScope',
    'loginService',
    function($scope, $location, $rootScope, loginService) {
        $scope.errorFlag = false;
        $scope.errorMsg = "";
        $rootScope.token = "";
        $scope.userDetails = {
            'username': '',
            'password': ''
        };
        $scope.redirectToSignUp = function() {
            $location.path("/signUp");
        };
        $scope.login = function(form) {
            if ((form.$valid) && ($scope.userDetails.username.length > 0) && ($scope.userDetails
                    .password.length > 0)) {
                loginService.userLogin($scope.userDetails).then(function(responseData) {
                    $rootScope.token = responseData.token;
                    if (responseData.success == true) {
                        if ($rootScope.token != undefined && $rootScope.token != null) {
                            loginService.getUserDetails($rootScope.token).then(function(responseData) {
                                $rootScope.welcomeMessage = responseData.msg;
                                $rootScope.userName = responseData.username;
                                $rootScope.id = responseData.id;
                                $scope.errorFlag = false;
                                $location.path("/dashboard");
                            });
                        } else {
                            $location.path("/login");
                        }
                    } else {
                        $scope.errorMsg = responseData.msg;
                        $scope.errorFlag = true;
                        $scope.disableLogin = false;
                    }
                });
            } else {
                $scope.errorMsg = responseData.msg;
                $scope.errorFlag = true;
                $scope.disableLogin = false;
            }

            if (!$scope.disableLogin && ($scope.userDetails.username.length > 0) && (
                    $scope.userDetails.password.length > 0)) {
                    $scope.disableLogin = true;
            } else {
                    $scope.disableLogin = false;
            }
        }
    }
]);/* Attaching new file */'use strict';
app.controller('signUpController', ['$scope', '$location', '$rootScope',
'loginService','$timeout',
function($scope, $location, $rootScope, loginService,$timeout) {
    $scope.errorSignUpFlag = false;
    $scope.signUpSuccess = false;
    $scope.disableSubmit = false;
    $scope.errorMsg = "";
    $rootScope.token = "";
    $scope.userInfo = {
        'userId': '',
        'passcode': ''
    };
    $scope.userSignUp = function(form) {
        if ((form.$valid) && ($scope.userInfo.userId.length > 0) && ($scope.userInfo.passcode.length > 0)) {
            loginService.userSignUp($scope.userInfo).then(function(responseData) {
                if(responseData.success == true){
                    $scope.signUpSuccess = true;
                    $scope.errorSignUpFlag = false;
                    $scope.successMsg =responseData.msg; 
                    $timeout(function() {
                        $location.path("/login");
                    }, 3000);
                }else{
                    $scope.errorSignUpFlag = true;
                    $scope.signUpSuccess = false;
                    $scope.errorMsg =responseData.msg;
                    $scope.disableSubmit = false;
                }
            });
    } else {
        $scope.errorSignUpFlag = true;
    }

    if (!$scope.disableSubmit && ($scope.userInfo.userId.length > 0) && (
            $scope.userInfo.passcode.length > 0)) {
            $scope.disableSubmit = true;
    } else {
            $scope.disableSubmit = false;
    }
}
}]);/* Attaching new file */'use strict';

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
}]);/* Attaching new file */'use strict';

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
}]);/* Attaching new file */'use strict';

app.controller('employeeController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'employeeDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, employeeDataService) {
    $rootScope.showEmployeeForm =false;
    $scope.successMessage = "";
    $scope.showAddEmployeeForm = function(){
        $rootScope.showEmployeeForm =true;
    };
}]);
/* Attaching new file */app.controller('employeeListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'employeeDataService', '$location', 'filteredListService', '$filter', function($resource, $http, $q, $scope, $interval, $rootScope, $timeout, employeeDataService, $location, filteredListService, $filter) {
    $rootScope.showEmployeeForm = false;
    loadTableData();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";

    function loadTableData() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            employeeDataService.getAllEmployees($rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("employeeId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.employees.length; i++) {
            $scope.allItems.push(responseData.employees[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            employeeDataService.editEmployee($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.employeeId === responseData.editedEmployee.employeeId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedEmployee);
                        $scope.resetAll();
                        $scope.sort("employeeId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            employeeDataService.removeEmployee(item.employeeId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.employeeId === responseData.deletedemployeeId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("employeeId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule="Employee";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText,$scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "employeeId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "name") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "phoneNumber") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "email") {
            $scope.Header[3] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[4] = iconName;
        } else {
            $scope.Header[5] = iconName;
        }
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilEmployee(item, toSearch) {
    return (item.employeeId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.phoneNumber.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.email.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.role.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}/* Attaching new file */'use strict';

app.controller('addInventoryController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'inventoryDataService','locationDataService','sectionDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, inventoryDataService,locationDataService,sectionDataService, $route, $location) {
    $scope.successMessageInventory = "";
    $scope.locationListForInventory = [];
    $scope.sectionListForInventory = [];
    $scope.tableList = [];
    $scope.selectedSection = "";
    $scope.selectedLocationIdInv = "";
    $scope.selectedLocationNameInv = "";
    $scope.selectedSectionIdInv = "";
    $scope.selectedSectionNameInv = "";

    $scope.formClear = function() {
        $scope.inputLocation = "";
        $scope.inputSection = "";
    };
    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForInventory, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdInv = locationSelected[0].locationId;
            $scope.selectedLocationNameInv = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdInv', function() {
        if ($scope.selectedLocationIdInv != undefined && $scope.selectedLocationIdInv != "") {
            var selectedLocationIdInv = $scope.selectedLocationIdInv;
            $scope.getSectionList(selectedLocationIdInv);
        }
    });
    $scope.getSectionSelected = function(section) {
        if ($scope.inputSection != null && $scope.inputSection != undefined && $scope.inputSection != "") {
            var sectionIdSelected = $scope.inputSection;
            var sectionSelected = $.grep($scope.sectionListForInventory, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdInv = sectionSelected[0].sectionId;
            $scope.selectedSectionNameInv = sectionSelected[0].sectionName;
        }
    };
    
    $scope.saveInventoryForm = function() {
        if ($scope.selectedLocationIdInv != null && $scope.selectedLocationIdInv != undefined && $scope.selectedLocationNameInv != null && $scope.selectedLocationNameInv != undefined && $scope.selectedSectionIdInv != null && $scope.selectedSectionIdInv != undefined && $scope.selectedSectionIdInv != null && $scope.selectedSectionIdInv != undefined && $scope.selectedSectionNameInv != null && $scope.selectedSectionNameInv != undefined) {
            var inventoryInfo = [{
                "locationId": $scope.selectedLocationIdInv,
                "locationName":$scope.selectedLocationNameInv,
                "sectionId": $scope.selectedSectionIdInv,
                "sectionName": $scope.selectedSectionNameInv,
                "inventoryName": $scope.inventoryName,
                "price": $scope.price,
                "quantity": $scope.quantity
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                inventoryDataService.addNewInventory(inventoryInfo, $rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessageInventory = responseData.msg;
                    $timeout(function() {
                        $scope.successMessageInventory = "";
                        $rootScope.showInventoryForm = false;
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
                    $scope.locationListForInventory.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationIdTab) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdTab != "" && selectedLocationIdTab != null && selectedLocationIdTab != undefined) {
            sectionDataService.getASection($rootScope.token, selectedLocationIdTab).then(function(responseData) {
                $scope.sectionListForInventory = [];
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionListForInventory.push({
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
}]);/* Attaching new file */'use strict';

app.controller('inventoryController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'inventoryDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, inventoryDataService) {
    $rootScope.showInventoryForm =false;
    $scope.successMessageInventory = "";
    $scope.showAddInventoryForm = function(){
        $rootScope.showInventoryForm =true;
    };
}]);
/* Attaching new file */app.controller('inventoryListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'inventoryDataService', 'locationDataService', 'sectionDataService', '$location', 'filteredListService', '$filter', function($resource, $http, $q, $scope, $interval, $rootScope, $timeout, inventoryDataService, locationDataService, sectionDataService, $location, filteredListService, $filter) {
    $rootScope.showSectionForm = false;
    getLocationList();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";
    $scope.selectedLocationIdInvList = "";
    $scope.selectedLocationNameInvList = "";
    $scope.selectedSectionIdInvList = "";
    $scope.selectedSectionNameInvList = "";
    $scope.sectionListForInventoryTable = [];
    $scope.locationListForInventoryTable = [];

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocationForList != null && $scope.inputLocationForList != undefined && $scope.inputLocationForList != "") {
            var locationIdSelected = $scope.inputLocationForList;
            var locationSelected = $.grep($scope.locationListForInventoryTable, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdInvList = locationSelected[0].locationId;
            $scope.selectedLocationNameInvList = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdInvList', function() {
        if ($scope.selectedLocationIdInvList != undefined && $scope.selectedLocationIdInvList != "") {
            var selectedLocationIdInvList = $scope.selectedLocationIdInvList;
            $scope.getSectionList(selectedLocationIdInvList);
        }
    });
    $scope.getSectionSelected = function(section) {
        if ($scope.inputSectionForList != null && $scope.inputSectionForList != undefined && $scope.inputSectionForList != "") {
            var sectionIdSelected = $scope.inputSectionForList;
            var sectionSelected = $.grep($scope.sectionListForInventoryTable, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdInvList = sectionSelected[0].sectionId;
            $scope.selectedSectionNameInvList = sectionSelected[0].sectionName;
        }
    };
    $scope.$watch('selectedSectionIdInvList', function() {
        if ($scope.selectedSectionIdInvList != undefined && $scope.selectedSectionIdInvList != "") {
            var selectedSectionIdInvList = $scope.selectedSectionIdInvList;
            loadTableData();
        }
    });

    function getLocationList() {
        $scope.allItems = [];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                for (var i = 0; i < responseData.location.length; i++) {
                    $scope.locationListForInventoryTable.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationIdInvList) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdInvList != "" && selectedLocationIdInvList != null && selectedLocationIdInvList != undefined) {
            sectionDataService.getASection($rootScope.token, selectedLocationIdInvList).then(function(responseData) {
                $scope.sectionListForInventoryTable = [];
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionListForInventoryTable.push({
                        sectionName: responseData.section[i].sectionName,
                        sectionId: responseData.section[i].sectionId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };

    function loadTableData() {
         $scope.allItems = [];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            inventoryDataService.getAllInventory($scope.selectedLocationIdInvList, $scope.selectedSectionIdInvList, $rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("inventoryId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        $scope.allItems = [];
        for (var i = 0; i < responseData.invent.length; i++) {
            $scope.allItems.push(responseData.invent[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            inventoryDataService.editAnInventory($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.inventoryId === responseData.editedInventory.inventoryId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedInventory);
                        $scope.resetAll();
                        $scope.sort("inventoryId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            inventoryDataService.deleteInventory(item.sectionId, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.inventoryId === responseData.deletedinventoryId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("inventoryId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule = "Inventory";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText, $scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "inventoryId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "inventoryName") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "price") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "quantity") {
            $scope.Header[3] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[4] = iconName;
        } else {
            $scope.Header[5] = iconName;
        }
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilInventory(item, toSearch) {
    return (item.inventoryId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.inventoryName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.price.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.quantity.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}/* Attaching new file */'use strict';

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
}]);/* Attaching new file */'use strict';

app.controller('locationController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'locationDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, locationDataService) {
    $rootScope.showLocationForm =false;
    $scope.successMessage = "";
    $scope.showAddLocationForm = function(){
        $rootScope.showLocationForm =true;
    };
}]);
/* Attaching new file */app.controller('locationListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'locationDataService', '$location','$filter','filteredListService', function($resource, $http, $q, $scope, $interval, $rootScope, $timeout, locationDataService, $location, $filter,filteredListService) {
    $rootScope.showLocationForm = false;
    loadTableData();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";

    function loadTableData() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("locationId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.location.length; i++) {
            $scope.allItems.push(responseData.location[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.editLocation($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.locationId === responseData.editedLocation.locationId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedLocation);
                        $scope.resetAll();
                        $scope.sort("locationId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.removeLocation(item.locationId, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.locationId === responseData.deletedlocationId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("locationId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule="Location";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText, $scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "locationId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "sectionName") {
            $scope.Header[2] = iconName;
        } else {
            $scope.Header[3] = iconName;
        } 
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilLocation(item, toSearch) {
    return (item.locationId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.orderId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1)  ? true : false;
}/* Attaching new file */'use strict';

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
}]);/* Attaching new file */'use strict';

app.controller('orderController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'orderDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, orderDataService) {
    $rootScope.showOrderForm =false;
    $scope.successMessageOrder = "";
    $scope.showAddOrderForm = function(){
        $rootScope.showOrderForm =true;
    };
}]);
/* Attaching new file */app.controller('orderListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'orderDataService','locationDataService','$location','filteredListService', '$filter', function ($resource, $http, $q, $scope,  $interval, $rootScope, $timeout, orderDataService,locationDataService,$location,filteredListService, $filter) {
    $rootScope.showSectionForm = false;
    getLocationList();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";
    $scope.selectedLocationIdOrdList = "";
    $scope.selectedLocationNameOrdList = "";
    $scope.locationListForOrderTable = [];

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocationForList != null && $scope.inputLocationForList != undefined && $scope.inputLocationForList != "") {
            var locationIdSelected = $scope.inputLocationForList;
            var locationSelected = $.grep($scope.locationListForOrderTable, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdOrdList = locationSelected[0].locationId;
            $scope.selectedLocationNameOrdList = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdOrdList', function() {
        if ($scope.selectedLocationIdOrdList != undefined && $scope.selectedLocationIdOrdList != "") {
            var selectedLocationIdOrdList = $scope.selectedLocationIdOrdList;
            loadTableData(selectedLocationIdOrdList);
        }
    });
    function getLocationList() {
        $scope.allItems = [];
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                for (var i = 0; i < responseData.location.length; i++) {
                    $scope.locationListForOrderTable.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };

    function loadTableData(selectedLocationIdInvList) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            orderDataService.getAllOrders(selectedLocationIdInvList,$rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("orderId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.order.length; i++) {
            $scope.allItems.push(responseData.order[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            orderDataService.editAnOrder($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.orderId === responseData.editedOrder.orderId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedOrder);
                        $scope.resetAll();
                        $scope.sort("orderId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            orderDataService.deleteOrder(item.orderId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.orderId === responseData.deletedId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("orderId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule="Orders";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText, $scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "orderId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "employeeId") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "tableId") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "locationId") {
            $scope.Header[3] = iconName;
        } else {
            $scope.Header[4] = iconName;
        } 
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilOrder(item, toSearch) {
    return (item.orderId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.employeeId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.tableId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}/* Attaching new file */'use strict';

app.controller('addSectionController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', 'locationDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService, locationDataService, $route, $location) {
    $scope.successMessageSection = "";
    $scope.locationListForSection = [];
    $scope.sectionList = [];
    $scope.selectedTable = "";
    $scope.selectedLocationId = "";
    $scope.selectedLocationName = "";
    $scope.formClear = function() {
        $scope.inputLocation = "";
        $scope.selectedSection = "";
    };

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForSection, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationId = locationSelected[0].locationId;
            $scope.selectedLocationName = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationId', function() {
        if ($scope.selectedLocationId != undefined && $scope.selectedLocationId != "") {
            var selectedLocationId = $scope.selectedLocationId;
            $scope.getSectionList(selectedLocationId);
        }
    });
    $scope.saveSectionForm = function() {
        if ($scope.selectedLocationId != undefined && $scope.selectedLocationId != null && $scope.selectedLocationName != undefined && $scope.selectedLocationName != null && $scope.selectedSection != null && $scope.selectedSection != undefined) {
            var sectionInfo = [{
                "locationId": $scope.selectedLocationId,
                "locationName": $scope.selectedLocationName,
                "sectionName": $scope.selectedSection,
                "tableName": ""
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                sectionDataService.addNewSection(sectionInfo, $rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessageSection = responseData.msg;
                    $timeout(function() {
                        $scope.successMessageSection = "";
                        $rootScope.showTableForm = false;
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
                    $scope.locationListForSection.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationId) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationId != null && selectedLocationId != undefined && selectedLocationId != "") {
            sectionDataService.getASection($rootScope.token, selectedLocationId).then(function(responseData) {
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionList.push(responseData.section[i].sectionName);
                }

            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getLocationList();
}]);/* Attaching new file */'use strict';

app.controller('sectionController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService) {
    $rootScope.showSectionForm =false;
    $scope.successMessageSection = "";
    $scope.showAddSectionForm = function(){
        $rootScope.showSectionForm =true;
    };
}]);
/* Attaching new file */app.controller('sectionListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'sectionDataService','$location','filteredListService', '$filter', function ($resource, $http, $q, $scope,  $interval, $rootScope, $timeout, sectionDataService,$location,filteredListService, $filter) {
    $rootScope.showSectionForm = false;
    loadTableData();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";

    function loadTableData() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            sectionDataService.getAllSection($rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("sectionId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.section.length; i++) {
            $scope.allItems.push(responseData.section[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            sectionDataService.editSection($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.sectionId === responseData.editedSection.sectionId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedSection);
                        $scope.resetAll();
                        $scope.sort("sectionId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            sectionDataService.removeSection(item.sectionId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.sectionId === responseData.deletedsectionId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("sectionId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule="Section";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText, $scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "sectionId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "locationId") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[2] = iconName;
        } else if (sortBy === "sectionName") {
            $scope.Header[3] = iconName;
        } else {
            $scope.Header[4] = iconName;
        } 
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilSection(item, toSearch) {
    return (item.sectionId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}/* Attaching new file */'use strict';

app.controller('addTableController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', 'locationDataService', 'tableDataService', '$route', '$location', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService, locationDataService, tableDataService, $route, $location) {
    $scope.successMessageTable = "";
    $scope.locationListForSection = [];
    $scope.sectionListForTable = [];
    $scope.tableList = [];
    $scope.selectedSection = "";
    $scope.selectedLocationIdTab = "";
    $scope.selectedLocationNameTab = "";
    $scope.selectedSectionIdTab = "";
    $scope.selectedSectionNameTab = "";

    $scope.formClear = function() {
        $scope.selectedTable = "";
        $scope.inputLocation = "";
        $scope.inputSection = "";
    };
    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForSection, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdTab = locationSelected[0].locationId;
            $scope.selectedLocationNameTab = locationSelected[0].locationName;
        }
    };
    $scope.$watch('selectedLocationIdTab', function() {
        if ($scope.selectedLocationIdTab != undefined && $scope.selectedLocationIdTab != "") {
            var selectedLocationIdTab = $scope.selectedLocationIdTab;
            $scope.getSectionList(selectedLocationIdTab);
        }
    });
    $scope.getSectionSelected = function(section) {
        if ($scope.inputSection != null && $scope.inputSection != undefined && $scope.inputSection != "") {
            var sectionIdSelected = $scope.inputSection;
            var sectionSelected = $.grep($scope.sectionListForTable, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdTab = sectionSelected[0].sectionId;
            $scope.selectedSectionNameTab = sectionSelected[0].sectionName;
        }
    };
    $scope.$watch('selectedSectionIdTab', function() {
        if ($scope.selectedSectionIdTab != undefined && $scope.selectedSectionIdTab != "") {
            var selectedSectionIdTab = $scope.selectedSectionIdTab;
            $scope.getTableList(selectedSectionIdTab);
        }
    });
    $scope.saveTableForm = function() {
        if ($scope.selectedLocationIdTab != null && $scope.selectedLocationIdTab != undefined && $scope.selectedLocationNameTab != null && $scope.selectedLocationNameTab != undefined && $scope.selectedSectionIdTab != null && $scope.selectedSectionIdTab != undefined && $scope.selectedSectionIdTab != null && $scope.selectedSectionIdTab != undefined && $scope.selectedSectionNameTab != null && $scope.selectedSectionNameTab != undefined) {
            var tableInfo = [{
                "locationId": $scope.selectedLocationIdTab,
                "locationName": $scope.selectedLocationNameTab,
                "sectionId": $scope.selectedSectionIdTab,
                "sectionName": $scope.selectedSectionNameTab,
                "tableName": $scope.selectedTable
            }];
            if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
                tableDataService.addNewTable(tableInfo, $rootScope.token).then(function(responseData) {
                    $scope.formClear();
                    $scope.successMessageTable = responseData.msg;
                    $timeout(function() {
                        $scope.successMessageTable = "";
                        $rootScope.showTableForm = false;
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
                    $scope.locationListForSection.push({
                        locationName: responseData.location[i].locationName,
                        locationId: responseData.location[i].locationId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getSectionList = function(selectedLocationIdTab) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedLocationIdTab != "" && selectedLocationIdTab != null && selectedLocationIdTab != undefined) {
            sectionDataService.getASection($rootScope.token, selectedLocationIdTab).then(function(responseData) {
                for (var i = 0; i < responseData.section.length; i++) {
                    $scope.sectionListForTable.push({
                        sectionName: responseData.section[i].sectionName,
                        sectionId: responseData.section[i].sectionId
                    });
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getTableList = function(selectedSectionIdTab) {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null && selectedSectionIdTab!=null && selectedSectionIdTab !="" && selectedSectionIdTab != undefined) {
            tableDataService.getATable($rootScope.token,selectedSectionIdTab).then(function(responseData) {
                for (var i = 0; i < responseData.table.length; i++) {
                    $scope.tableList.push(responseData.table[i].tableName);
                }
            });
        } else {
            $location.path("/login");
        }
    };
    $scope.getLocationList();
}]);/* Attaching new file */'use strict';

app.controller('tableController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'tableDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, tableDataService) {
    $rootScope.showTableForm =false;
    $scope.successMessageTable = "";
    $scope.showAddTableForm = function(){
        $rootScope.showTableForm =true;
    };
}]);
/* Attaching new file */app.controller('tableListController', ['$resource', '$http', '$q', '$scope', '$interval', '$rootScope', '$timeout', 'tableDataService', '$location','filteredListService', '$filter', function($resource, $http, $q, $scope, $interval, $rootScope, $timeout, tableDataService, $location,filteredListService, $filter) {
    $rootScope.showTableForm = false;
    loadTableData();
    $scope.tableShow = true;
    $scope.allItems = [];
    $scope.pageSize = 5;
    $scope.reverse = false;
    $scope.showModal = false;
    $scope.itemClicked = "";
    var iconName = "";

    function loadTableData() {
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            tableDataService.getAllTable($rootScope.token).then(function(responseData) {
                applyRemoteData(responseData);
                $scope.sort("tableId");
                $scope.tableShow = false;
            });
        } else {
            $location.path("/login");
        }
    }

    function applyRemoteData(responseData) {
        for (var i = 0; i < responseData.table.length; i++) {
            $scope.allItems.push(responseData.table[i]);
        }
    }
    $scope.openAddModal = function() {
        $scope.showAdd = false;
        $scope.shouldBeOpen = true;
    };

    $scope.openModal = function(item) {
        $scope.itemClicked = angular.copy(item);
        $scope.showModal = true;
    };

    $scope.saveEditValues = function() {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            tableDataService.editTable($scope.itemClicked, $rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.tableId === responseData.editedTable.tableId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.allItems.push(responseData.editedTable);
                        $scope.resetAll();
                        $scope.sort("tableId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }

    };
    $scope.deleteRow = function(item) {
        $scope.showModal = false;
        if ($rootScope.token != "" && $rootScope.token != undefined && $rootScope.token != null) {
            tableDataService.removeTable(item.tableId,$rootScope.token).then(function(responseData) {
                angular.forEach($scope.allItems, function(item) {
                    if (item.tableId === responseData.deletedtableId) {
                        var index = $scope.allItems.indexOf(item);
                        $scope.allItems.splice(index, 1);
                        $scope.resetAll();
                        $scope.sort("tableId");
                    }
                });
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.cancelEdit = function() {
        $scope.showModal = false;
    };

    $scope.resetAll = function() {
        $scope.filteredList = $scope.allItems;
        $scope.searchText = '';
        $scope.currentPage = 0;
        $scope.Header = ["", "", "", "", ""];
    }

    $scope.search = function() {
        $scope.searchModule="Tables";
        $scope.filteredList = filteredListService.searched($scope.allItems, $scope.searchText, $scope.searchModule);
        if ($scope.searchText == "") {
            $scope.filteredList = $scope.allItems;
        }
        $scope.pagination();
    }
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.firstPage();
    };
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };
    $scope.firstPage = function() {
        $scope.currentPage = 0;
    };
    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
    };
    setTimeout($scope.range = function(input, total) {
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    }, 6000);
    $scope.exportCSV = function exportCSV() {
        var data = alasql('SELECT * FROM HTML("#table",{headers:true})');
        alasql('SELECT * INTO XLSX("data.csv",{headers:true}) FROM ?', [data]);
    }
    $scope.sort = function(sortBy) {
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter("orderBy")($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse)
            iconName = "glyphicon glyphicon-chevron-up";
        else
            iconName = "glyphicon glyphicon-chevron-down";
        if (sortBy === "tableId") {
            $scope.Header[0] = iconName;
        } else if (sortBy === "locationId") {
            $scope.Header[1] = iconName;
        } else if (sortBy === "locationName") {
            $scope.Header[2] = iconName;
        }else if (sortBy === "sectionId") {
            $scope.Header[3] = iconName;
        } else if (sortBy === "sectionName") {
            $scope.Header[4] = iconName;
        }else if (sortBy === "tableName") {
            $scope.Header[4] = iconName;
        }  else {
            $scope.Header[5] = iconName;
        } 
        $scope.reverse = !$scope.reverse;
        $scope.pagination();
    };
}]);

function searchUtilTables(item, toSearch) {
    return (item.tableName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.tableId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationId.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.locationName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.sectionName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
}/* Attaching new file */app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
});/* Attaching new file */app.directive('focusMe', function($timeout) {
    return {
        scope: {
            trigger: '@focusMe'
        },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === "true") {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});/* Attaching new file */'use strict';

app.directive('resize', function($window) {
    return function(scope, element, attr) {
        var w = angular.element($window);
        scope.$watch(function() {
            return {
                'h': w.height(),
                'w': w.width()
            };
        }, function(newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function(offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function() {
            scope.$apply();
        });
    };
});/* Attaching new file */app.service("employeeDataService", function($http, $q) {
    return ({
        addNewEmployee: addNewEmployee,
        getAllEmployees:getAllEmployees,
        editEmployee:editEmployee,
        removeEmployee:removeEmployee,
        getAnEmployee:getAnEmployee
    });

    function addNewEmployee(employeeInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/addEmployee',
            headers: {
                Authorization: token
            },
            data: {
                employeeInfo: employeeInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function editEmployee(employeeEditInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/editEmployee',
            headers: {
                Authorization: token
            },
            data: {
                employeeEditInfo: employeeEditInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function removeEmployee(employeeId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/removeEmployee',
            headers: {
                Authorization: token
            },
            data: {
                employeeId: employeeId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getAllEmployees(token) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/getAllEmployees',
            headers: {
                Authorization: token
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getAnEmployee(token,locationId) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/getAnEmployee',
            headers: {
                Authorization: token
            },
            data: {
                locationId: locationId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getRestaurantDetails(selectedLocation) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/getRestaurantDetails',
            headers: {
                Authorization: token
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});/* Attaching new file */app.service('filteredListService', function() {
    this.searched = function(valLists, toSearch, searchModule) {
        if (searchModule == "Employee") {
            return _.filter(valLists, function(i) {
                return searchUtilEmployee(i, toSearch);
            });
        }else if(searchModule =="Location"){
             return _.filter(valLists, function(i) {
                return searchUtilLocation(i, toSearch);
            });
        }
        else if(searchModule =="Section"){
             return _.filter(valLists, function(i) {
                return searchUtilSection(i, toSearch);
            });
        }else if(searchModule =="Tables"){
             return _.filter(valLists, function(i) {
                return searchUtilTables(i, toSearch);
            });
        }else if(searchModule =="Orders"){
             return _.filter(valLists, function(i) {
                return searchUtilOrder(i, toSearch);
            });
        }else{
            return _.filter(valLists, function(i) {
                return searchUtilInventory(i, toSearch);
            });
        }
    };
    this.paged = function(valLists, pageSize) {
        var retVal = [];
        for (var i = 0; i < valLists.length; i++) {
            if (i % pageSize === 0) {
                retVal[Math.floor(i / pageSize)] = [valLists[i]];
            } else {
                retVal[Math.floor(i / pageSize)].push(valLists[i]);
            }
        }
        return retVal;
    };
});/* Attaching new file */app.service("inventoryDataService", function($http, $q) {
    return ({
        addNewInventory: addNewInventory,
        getAllInventory:getAllInventory,
        deleteInventory:deleteInventory,
        editAnInventory:editAnInventory
    });

    function addNewInventory(inventoryInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/addNewInventory',
            headers: {
                Authorization: token
            },
            data: {
                inventoryInfo: inventoryInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function editAnInventory(inventoryEditInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/editInventory',
            headers: {
                Authorization: token
            },
            data: {
                inventoryEditInfo: inventoryEditInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function deleteInventory(orderId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/removeInventory',
            headers: {
                Authorization: token
            },
            data: {
                orderId: orderId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getAllInventory(locationId,sectionId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/getAllInventory',
            headers: {
                Authorization: token
            },
            data: {
                locationId: locationId,
                sectionId: sectionId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    
    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});/* Attaching new file */app.service("locationDataService", function($http, $q) {
    return ({
        addNewLocation: addNewLocation,
        getAllLocation:getAllLocation,
        editLocation:editLocation,
        removeLocation:removeLocation
    });

    function addNewLocation(locationInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/addLocation',
            headers: {
                Authorization: token
            },
            data: {
                locationInfo: locationInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function editLocation(locationEditInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/editLocation',
            headers: {
                Authorization: token
            },
            data: {
                locationEditInfo: locationEditInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function removeLocation(locationId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/removeLocation',
            headers: {
                Authorization: token
            },
            data: {
                locationId: locationId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getAllLocation(token) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/getAllLocations',
            headers: {
                Authorization: token
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});/* Attaching new file */app.service("loginService", function($http, $q) {
    return ({
        userLogin: userLogin,
        userSignUp:userSignUp,
        getUserDetails: getUserDetails
    });

    function userLogin(userDetails) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/authenticate',
            data: {
                userDetails: userDetails
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function userSignUp(userInfo) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/signup',
            data: {
                userInfo: userInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }

    function getUserDetails(token) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/memberinfo',
            headers: {
                Authorization: token
            }
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});/* Attaching new file */app.service("orderDataService", function($http, $q) {
    return ({
        addNewOrder: addNewOrder,
        getAllOrders:getAllOrders,
        deleteOrder:deleteOrder,
        editAnOrder:editAnOrder
    });

    function addNewOrder(orderInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/addOrder',
            headers: {
                Authorization: token
            },
            data: {
                orderInfo: orderInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function editAnOrder(orderEditInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/editOrder',
            headers: {
                Authorization: token
            },
            data: {
                orderEditInfo: orderEditInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function deleteOrder(orderId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/removeOrder',
            headers: {
                Authorization: token
            },
            data: {
                orderId: orderId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getAllOrders(locationId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/getAllOrders',
            headers: {
                Authorization: token
            },
            data: {
                locationId: locationId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});/* Attaching new file */app.service("sectionDataService", function($http, $q) {
    return ({
        addNewSection: addNewSection,
        getAllSection:getAllSection,
        editSection:editSection,
        removeSection:removeSection,
        getASection:getASection
    });

    function addNewSection(sectionInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/addSection',
            headers: {
                Authorization: token
            },
            data: {
                sectionInfo: sectionInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function editSection(sectionEditInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/editSection',
            headers: {
                Authorization: token
            },
            data: {
                sectionEditInfo: sectionEditInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function removeSection(sectionId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/removeSection',
            headers: {
                Authorization: token
            },
            data: {
                sectionId: sectionId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
     function getAllSection(token) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/getAllSections',
            headers: {
                Authorization: token
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getASection(token,locationId) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/getASection',
            headers: {
                Authorization: token
            },
            data: {
                locationId: locationId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});/* Attaching new file */app.service("tableDataService", function($http, $q) {
    return ({
        addNewTable: addNewTable,
        getAllTable:getAllTable,
        editTable:editTable,
        removeTable:removeTable,
        getATable:getATable
    });

    function addNewTable(tableInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/addTable',
            headers: {
                Authorization: token
            },
            data: {
                tableInfo: tableInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
     function editTable(tableEditInfo,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/editTable',
            headers: {
                Authorization: token
            },
            data: {
                tableEditInfo: tableEditInfo
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function removeTable(tableId,token) {
        var request = $http({
            method: "POST",
            url: 'http://localhost:3000/api/removeTable',
            headers: {
                Authorization: token
            },
            data: {
                tableId: tableId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
     function getAllTable(token) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/getAllTables',
            headers: {
                Authorization: token
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function getATable(token,sectionId) {
        var request = $http({
            method: "GET",
            url: 'http://localhost:3000/api/getATable',
            headers: {
                Authorization: token
            },
            data: {
                sectionId: sectionId
            }
        });
        return (request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        var ret = '';
        if (!angular.isObject(response.data) || !response.data.message) {
            ret = ($q.reject("An unknown error occurred."));
        }
        if (ret.length == 0) {
            ret = ($q.reject(response.data.message));
        }
        return ret;
    }

    function handleSuccess(response) {
        return (response.data);
    }
});