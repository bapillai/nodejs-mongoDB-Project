app.service("employeeDataService", function($http, $q) {
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
});