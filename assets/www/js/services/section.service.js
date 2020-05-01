app.service("sectionDataService", function($http, $q) {
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
});