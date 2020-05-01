app.service("inventoryDataService", function($http, $q) {
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
});