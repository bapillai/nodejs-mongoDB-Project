app.service("orderDataService", function($http, $q) {
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
});