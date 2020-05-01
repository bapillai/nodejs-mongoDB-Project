var Sections = require('../app/models/sections'); // get the mongoose model
var Tables = require('../app/models/tables'); // get the mongoose model
var Location = require('../app/models/location'); // get the mongoose model
var Orders = require('../app/models/order'); // get the mongoose model
var Inventory = require('../app/models/inventory'); // get the mongoose model

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var mongoose = require('mongoose');
var config = require('../config/database');

// Get a list of all registered inventory (GET http://localhost:3000/api/getAllInventory)
exports.getAllInventory = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            locationId: req.body.locationId,
            sectionId: req.body.sectionId
        };
        Inventory.find(query, function(err, invent) {
            if (err) throw err;

            if (!invent) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var inventoryMap = {};
                inventoryMap = invent;

                res.json({
                    success: true,
                    msg: 'New Table Added ' + inventoryMap + '!',
                    invent: inventoryMap
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

// Add a new Inventory(GET http://localhost:3000/api/addNewInventory)
exports.addNewInventory = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        if (!req.body.inventoryInfo[0]) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newInventory = new Inventory({
                inventoryId: mongoose.Types.ObjectId(),
                inventoryName: req.body.inventoryInfo[0].inventoryName,
                price: req.body.inventoryInfo[0].price,
                quantity: req.body.inventoryInfo[0].quantity,
                locationId: req.body.inventoryInfo[0].locationId,
                locationName: req.body.inventoryInfo[0].locationName,
                sectionId: req.body.inventoryInfo[0].sectionId,
                sectionName: req.body.inventoryInfo[0].sectionName
            });
            // save the inventory
            newInventory.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Inventory already exists.'
                    });
                }
                res.json({
                    success: true,
                    msg: 'Successfully created Inventory.'
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

// Delete a particular inventory (POST http://localhost:3000/api/removeInventory)
exports.removeInventory = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Inventory.findOneAndRemove(req.body.inventoryId, function(err, invent) {
            if (err) throw err;

            if (!invent) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. inventory not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'inventory successfully deleted',
                    deletedinventoryId: invent.inventoryId
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

// Edit a particular inventory (POST http://localhost:3000/api/editInventory)
exports.editInventory = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            inventoryId: req.body.inventoryEditInfo.inventoryId
        };
        var update = {
            inventoryName: req.body.inventoryEditInfo.inventoryName,
            price: req.body.inventoryEditInfo.price,
            quantity: req.body.inventoryEditInfo.quantity,
            locationId: req.body.inventoryEditInfo.locationId,
            sectionId: req.body.inventoryEditInfo.sectionId
        };
        var options = {
            new: true,
            upsert: true
        };
        Inventory.findOneAndUpdate(query, update, options, function(err, invent) {
            if (err) {
                throw err;
                console.log("inventory not found");
            }
            if (!invent) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. inventory not found.'
                });
            } else {
                var inventoryMap = {};
                inventoryMap = invent;
                res.json({
                    success: true,
                    msg: 'Inventory has been updated',
                    editedInventory: inventoryMap
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