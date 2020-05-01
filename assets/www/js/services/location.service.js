app.service("locationDataService", function($http, $q) {
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
});