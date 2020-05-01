var Employee = require('../app/models/employee'); // get the mongoose model

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');
var mongoose = require('mongoose');
var config = require('../config/database');

// Get a list of all registered employees (GET http://localhost:3000/api/getAllEmployees)
exports.getAllEmployees = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Employee.find({}, function(err, employee) {
            if (err) throw err;

            if (!employee) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. employee not found.'
                });
            } else {
                var employeeMap = {};
                employeeMap = employee;

                res.json({
                    success: true,
                    msg: 'Welcome in the member area ' + employeeMap + '!',
                    employees: employeeMap
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

// Get a list of all registered employees (GET http://localhost:3000/api/getAnEmployee)
exports.getAnEmployee = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        console.log("req.body.locationId " + req.body.locationId);
        Employee.find({locationId:req.body.locationId}, function(err, employee) {
            if (err) throw err;

            if (!employee) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. employee not found.'
                });
            } else {
                var employeeMap = {};
                employeeMap = employee;

                res.json({
                    success: true,
                    msg: 'Welcome in the member area ' + employeeMap + '!',
                    employees: employeeMap
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
//Add a new Employee(POST http://localhost:3000/api/addEmployee)
exports.addNewEmployee = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        if (!req.body.employeeInfo[0]) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newEmployee = new Employee({
                employeeId: mongoose.Types.ObjectId(),
                name: req.body.employeeInfo[0].name,
                phoneNumber: req.body.employeeInfo[0].phoneNumber,
                email: req.body.employeeInfo[0].email,
                locationId: req.body.employeeInfo[0].locationId,
                locationName: req.body.employeeInfo[0].locationName,
                sectionName: req.body.employeeInfo[0].sectionName,
                role: req.body.employeeInfo[0].role
            });
            // save the user
            newEmployee.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Employee already exists.'
                    });
                }
                res.json({
                    success: true,
                    msg: 'Successfully created employee.'
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


// Delete a particular employee (POST http://localhost:3000/api/removeEmployee)
exports.removeEmployee = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        Employee.findOneAndRemove(req.body.employeeId, function(err, employee) {
            if (err) throw err;

            if (!employee) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. employee not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'employee successfully deleted',
                    deletedemployeeId: employee.employeeId
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

// Edit a particular employee (POST http://localhost:3000/api/editEmployee)
exports.editEmployee = function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        var query = {
            employeeId: req.body.employeeEditInfo.employeeId
        };
        var update = {
            name: req.body.employeeEditInfo.name,
            phoneNumber: req.body.employeeEditInfo.phoneNumber,
            email: req.body.employeeEditInfo.email,
            locationName: req.body.employeeEditInfo.locationName,
            role: req.body.employeeEditInfo.role
        };
        var options = {
            new: true,
            upsert: true
        };
        Employee.findOneAndUpdate(query, update, options, function(err, employee) {
            if (err) {
                throw err;
                console.log("employee not found");
            }
            if (!employee) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. employee not found.'
                });
            } else {
                var employeeMap = {};
                employeeMap = employee;
                res.json({
                    success: true,
                    msg: 'Employee has been updated',
                    editedEmployee: employeeMap
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