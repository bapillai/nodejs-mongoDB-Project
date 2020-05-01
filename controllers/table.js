var Sections = require('../app/models/sections'); // get the mongoose model
var Tables = require('../app/models/tables'); // get the mongoose model

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var mongoose = require('mongoose');
var config = require('../config/database');

// Get a list of all registered tables (GET http://localhost:3000/api/getAllTables)
exports.getAllTables = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Tables.find({}, function(err, table) {
            if (err) throw err;

            if (!table) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var tableMap = {};
                tableMap = table;

                res.json({
                    success: true,
                    msg: 'New Table Added ' + tableMap + '!',
                    table: tableMap
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

// Get a list of all registered tables (GET http://localhost:3000/api/getATable)
exports.getATable = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Tables.find(req.body.sectionId, function(err, table) {
            if (err) throw err;

            if (!table) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var tableMap = {};
                tableMap = table;

                res.json({
                    success: true,
                    msg: 'New Table Added ' + tableMap + '!',
                    table: tableMap
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

// Add a new Table(GET http://localhost:3000/api/addTable)
exports.addNewTable = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        if (!req.body.tableInfo[0]) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newTable = new Tables({
                tableId: mongoose.Types.ObjectId(),
                tableName: req.body.tableInfo[0].tableName,
                locationId: req.body.tableInfo[0].locationId,
                locationName: req.body.tableInfo[0].locationName,
                sectionId: req.body.tableInfo[0].sectionId,
                sectionName: req.body.tableInfo[0].sectionName
            });
            // save the user
            newTable.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Section already exists.'
                    });
                } else {
                    var query = {
                        sectionId: req.body.tableInfo[0].sectionId
                    };
                    var update = {
                        tableName: req.body.tableInfo[0].tableName
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
                            console.log("section Id:", section);
                            sectionMap = section;

                            res.json({
                                success: true,
                                msg: 'Table Added and  section has been updated',
                                section: sectionMap
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
// Delete a particular Table (POST http://localhost:3000/api/removeTable)
exports.removeTable = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Tables.findOneAndRemove(req.body.tableId, function(err, table) {
            if (err) throw err;

            if (!table) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. table not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'table successfully deleted',
                    deletedtableId: table.tableId
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

// Edit a particular table (POST http://localhost:3000/api/editTable)
exports.editTable = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            tableId: req.body.tableEditInfo.tableId
        };
        var update = {
            tableId: req.body.tableEditInfo.tableId,
            tableName: req.body.tableEditInfo.tableName,
            locationId: req.body.tableEditInfo.locationId,
            locationName: req.body.tableEditInfo.locationName,
            sectionId: req.body.tableEditInfo.sectionId,
            sectionName: req.body.tableEditInfo.sectionName
        };
        var options = {
            new: true,
            upsert: true
        };
        Tables.findOneAndUpdate(query, update, options, function(err, table) {
            if (err) {
                throw err;
                console.log("section not found");
            }
            if (!table) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. table not found.'
                });
            } else {
                var tableMap = {};
                tableMap = table;
                res.json({
                    success: true,
                    msg: 'table has been updated',
                    editedTable: tableMap
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