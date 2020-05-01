var User = require('../app/models/user');

var qs = require('querystring');
var jwt = require('jwt-simple');
var request = require('request');

var config = require('../config/database');

// create a new user account (POST http://localhost:3000/api/signup)
exports.createUser = function(req, res, next) {
    if (!req.body.userInfo.userId || !req.body.userInfo.passcode) {
        res.json({
            success: false,
            msg: 'Please pass name and password.'
        });
    } else {
        var newUser = new User({
            name: req.body.userInfo.userId,
            password: req.body.userInfo.passcode
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Username already exists.'
                });
            }
            res.json({
                success: true,
                msg: 'Successful created new user.'
            });
        });
    }
};
// route to authenticate a user (POST http://localhost:3000/api/authenticate)
exports.authenticateUser = function(req, res) {
    User.findOne({
        name: req.body.userDetails.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        } else {
            // check if password matches
            user.comparePassword(req.body.userDetails.password, function(err,
                isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                    console.log("token : " + token);
                } else {
                    res.send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
};
// route to getrestricted info of  a user (POST http://localhost:3000/api/memberinfo)

exports.getAuthenticateUser = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authentication failed. User not found.'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Welcome in the member area ' + user.name + '!',
                    username: user.name,
                    id: user._id
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

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};