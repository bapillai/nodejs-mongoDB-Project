'use strict';
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
}]);