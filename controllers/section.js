var Sections = require('../app/models/sections'); // get the mongoose model
var Location = require('../app/models/location'); // get the mongoose model

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var mongoose = require('mongoose');
var config = require('../config/database');

// Get a list of all registered sections (GET http://localhost:3000/api/getAllSections)
exports.getAllSections = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Sections.find({}, function(err, section) {
            if (err) throw err;

            if (!section) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var sectionMap = {};
                sectionMap = section;

                res.json({
                    success: true,
                    msg: 'Welcome in the member area ' + sectionMap + '!',
                    section: sectionMap
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
// Get a list of all registered sections (GET http://localhost:3000/api/getASection)
exports.getASection = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Sections.find({locationId:req.body.locationId}, function(err, section) {
            if (err) throw err;

            if (!section) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var sectionMap = {};
                sectionMap = section;

                res.json({
                    success: true,
                    msg: 'Welcome in the member area ' + sectionMap + '!',
                    section: sectionMap
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

//Add a new Section(POST http://localhost:3000/api/addSection)
exports.addNewSection = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        if (!req.body.sectionInfo[0]) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newSection = new Sections({
                sectionId: mongoose.Types.ObjectId(),
                locationId: req.body.sectionInfo[0].locationId,
                locationName: req.body.sectionInfo[0].locationName,
                sectionName: req.body.sectionInfo[0].sectionName,
                tableName: req.body.sectionInfo[0].tableName
            });
            // save the user
            newSection.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Section already exists.'
                    });
                } else {
                    var query = {
                        locationId: req.body.sectionInfo[0].locationId
                    };
                    var update = {
                        sectionName: req.body.sectionInfo[0].sectionName,
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
                                msg: 'Section Added and location table has been updated',
                                location: locationMap
                            });
                        }
                    });
                }
            });
        }
    } else {
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
};


// Delete a particular section (POST http://localhost:3000/api/removeSection)
exports.removeSection = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Sections.findOneAndRemove(req.body.sectionId, function(err, section) {
            if (err) throw err;

            if (!section) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'section successfully deleted',
                    deletedsectionId: section.sectionId
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

// Edit a particular section (POST http://localhost:3000/api/editSection)
exports.editSection = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            sectionId: req.body.sectionEditInfo.sectionId
        };
        var update = {
            sectionId: req.body.sectionEditInfo.sectionId,
            locationId: req.body.sectionEditInfo.locationId,
            locationName: req.body.sectionEditInfo.locationName,
            sectionName: req.body.sectionEditInfo.sectionName,
            tableName: req.body.sectionEditInfo.tableName
        };
        var options = {
            new: true,
            upsert: true
        };
        Sections.findOneAndUpdate(query, update, options, function(err, section) {
            if (err) {
                throw err;
                console.log("section not found");
            }
            if (!section) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var sectionMap = {};
                sectionMap = section;
                res.json({
                    success: true,
                    msg: 'Section has been updated',
                    editedSection: sectionMap
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