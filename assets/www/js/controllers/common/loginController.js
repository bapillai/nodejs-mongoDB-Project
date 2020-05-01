'use strict';
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
]);