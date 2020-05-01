var Location = require('../app/models/location'); // get the mongoose model

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var mongoose = require('mongoose');
var config = require('../config/database');


// Get a list of all registered locations (GET http://localhost:3000/api/getAllLocations)
exports.getAllLocations = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Location.find({}, function(err, location) {
            if (err) throw err;

            if (!location) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. location not found.'
                });
            } else {
                var locationMap = {};
                locationMap = location;

                res.json({
                    success: true,
                    msg: 'Welcome in the member area ' + locationMap + '!',
                    location: locationMap
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
};


//Add a new Location(POST http://localhost:3000/api/addLocation)
exports.addNewLocation = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        if (!req.body.locationInfo[0]) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newLocation = new Location({
                locationId: mongoose.Types.ObjectId(),
                locationName: req.body.locationInfo[0].locationName,
                sectionName: req.body.locationInfo[0].sections,
                orderId: req.body.locationInfo[0].orderId
            });
            // save the user
            newLocation.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Location already exists.'
                    });
                }
                res.json({
                    success: true,
                    msg: 'Successfully added Location.'
                });
            });
        }
    } else {
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
};

// Delete a particular employee (POST http://localhost:3000/api/removeLocation)
exports.removeLocation = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Location.findOneAndRemove(req.body.locationId, function(err, location) {
            if (err) throw err;

            if (!location) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. employee not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'employee successfully deleted',
                    deletedlocationId: location.locationId
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
};

// Edit a particular location (POST http://localhost:3000/api/editLocation)
exports.editLocation = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            locationId: req.body.locationEditInfo.locationId
        };
        var update = {
            locationId: req.body.locationEditInfo.locationId,
            locationName: req.body.locationEditInfo.locationName,
            sectionName: req.body.locationEditInfo.sectionName,
            orderId: req.body.locationEditInfo.orderId
        };
        var options = {
            new: true,
            upsert: true
        };
        Location.findOneAndUpdate(query, update, options, function(err, location) {
            if (err) {
                throw err;
                console.log("location not found");
            }
            if (!location) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. location not found.'
                });
            } else {
                var locationMap = {};
                locationMap = location;
                res.json({
                    success: true,
                    msg: 'location has been updated',
                    editedLocation: locationMap
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
};