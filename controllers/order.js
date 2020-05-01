var Sections = require('../app/models/sections'); // get the mongoose model
var Tables = require('../app/models/tables'); // get the mongoose model
var Location = require('../app/models/location'); // get the mongoose model
var Orders = require('../app/models/order'); // get the mongoose model

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var mongoose = require('mongoose');
var config = require('../config/database');

// Get a list of all registered orders (GET http://localhost:3000/api/getAllOrders)
exports.getAllOrders = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        console.log("Location ID : " + req.body.locationId);
        var query = {
            locationId: req.body.locationId
        };
        Orders.find(query, function(err, order) {
            if (err) throw err;

            if (!order) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. section not found.'
                });
            } else {
                var orderMap = {};
                orderMap = order;

                res.json({
                    success: true,
                    msg: 'Result Table ' + orderMap + '!',
                    order: orderMap
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


// Add a new Order(GET http://localhost:3000/api/addNewOrder)
exports.addNewOrder = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        if (!req.body.orderInfo[0]) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newOrder = new Orders({
                orderId: mongoose.Types.ObjectId(),
                orderDesc: req.body.orderInfo[0].orderDesc,
                employeeId: req.body.orderInfo[0].employeeId,
                name: req.body.orderInfo[0].name,
                tableId: req.body.orderInfo[0].tableId,
                tableName: req.body.orderInfo[0].tableName,
                locationId: req.body.orderInfo[0].locationId,
                locationName: req.body.orderInfo[0].locationName,
                sectionId: req.body.orderInfo[0].sectionId,
                sectionName: req.body.orderInfo[0].sectionName,
                inventoryItems: req.body.orderInfo[0].inventoryItems,
                status:"Order Placed",
                dateCreated:new Date(),
                dateModified:""
            });
            // save the order
            newOrder.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Order already exists.'
                    });
                } else {
                    var query = {
                        locationId: req.body.orderInfo[0].locationId
                    };
                    var update = {
                        orderId: req.body.orderInfo[0].orderDesc
                    };
                    var options = {
                        new: true,
                        upsert: true
                    };
                    Location.findOneAndUpdate(query, update, options, function(err, location) {
                        if (err) {
                            throw err;
                            console.log("Location not found");
                        }
                        if (!location) {
                            return res.status(403).send({
                                success: false,
                                msg: 'Authentication failed. Location not found.'
                            });
                        } else {
                            var locationMap = {};
                            locationMap = location;
                            res.json({
                                success: true,
                                msg: 'Table Added and  Location has been updated',
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

// Delete a particular order (POST http://localhost:3000/api/removeOrder)
exports.removeOrder = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Orders.findOneAndRemove(req.body.orderId, function(err, order) {
            if (err) throw err;

            if (!order) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. order not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Order successfully deleted',
                    deletedId: order.orderId
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

// Edit a particular order (POST http://localhost:3000/api/editOrder)
exports.editOrder = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            orderId: req.body.orderEditInfo.orderId
        };
        var update = {
            orderDesc: req.body.orderEditInfo.orderDesc,
            employeeId: req.body.orderEditInfo.employeeId,
            name: req.body.orderEditInfo.name,
            tableId: req.body.orderEditInfo.tableId,
            tableName: req.body.orderEditInfo.tableName,
            locationId: req.body.orderEditInfo.locationId,
            locationName: req.body.orderEditInfo.locationName,
            sectionId: req.body.orderEditInfo.sectionId,
            sectionName: req.body.orderEditInfo.sectionName,
            inventoryItems: req.body.orderEditInfo.inventoryItems,
            status:req.body.orderEditInfo.status,
            dateCreated:req.body.orderEditInfo.dateCreated,
            dateModified:new Date()
        };
        var options = {
            new: true,
            upsert: true
        };
        Orders.findOneAndUpdate(query, update, options, function(err, order) {
            if (err) {
                throw err;
                console.log("order not found");
            }
            if (!order) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. order not found.'
                });
            } else {
                var orderMap = {};
                orderMap = order;
                res.json({
                    success: true,
                    msg: 'Order has been updated',
                    editedOrder: orderMap
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