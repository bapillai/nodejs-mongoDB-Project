var routes =  require('express').Router();
var authController = require('../controllers/auth');

routes.post('/signup',authController.createUser);

modules.exports = routes;
