app.service("loginService", function($http, $q) {
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
});