app.service("tableDataService", function($http, $q) {
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