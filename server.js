var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.createServer(app);
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database'); // get db config file
var auth = require('./controllers/auth');
var empl = require('./controllers/employee');
var loctn = require('./controllers/location');
var sectn = require('./controllers/section');
var table = require('./controllers/table');
var order = require('./controllers/order');
var inventory = require('./controllers/inventory');
var User = require('./app/models/user');
var port = 3000;
var jwt = require('jwt-simple');
var routes =  require('express').Router();

app.use(express.static(__dirname + '/assets'));
// get our request parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:3000)
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);



//******************************Start of API Calls*****************************************

//New User SignUp
routes.use('/signup',auth.createUser);

//User Authentication
routes.use('/authenticate',auth.authenticateUser);

//Get User Details
routes.use('/memberinfo',auth.getAuthenticateUser);

//Get all registered Employees
routes.use('/getAllEmployees',empl.getAllEmployees);

//Add a new registered Employee
routes.use('/addEmployee',empl.addNewEmployee);

//Delete a registered Employee
routes.use('/removeEmployee',empl.removeEmployee);

//Edit a registered Employee
routes.use('/editEmployee',empl.editEmployee);

//Get a registered Employees
routes.use('/getAnEmployee',empl.getAnEmployee);


//Get all registered Locations
routes.use('/getAllLocations',loctn.getAllLocations);

//Add a new registered Location
routes.use('/addLocation',loctn.addNewLocation);

//Delete a registered Location
routes.use('/removeLocation',loctn.removeLocation);

//Edit a registered Location
routes.use('/editLocation',loctn.editLocation);


//Get all registered Locations
routes.use('/getAllSections',sectn.getAllSections);

//Add a new registered Section
routes.use('/addSection',sectn.addNewSection);

//Delete a registered Section
routes.use('/removeSection',sectn.removeSection);

//Edit a registered Section
routes.use('/editSection',sectn.editSection);

//Get a registered Section
routes.use('/getASection',sectn.getASection);


//Get all registered Tables
routes.use('/getAllTables',table.getAllTables);

//Add a new registered Table
routes.use('/addTable',table.addNewTable);

//Delete a registered Table
routes.use('/removeTable',table.removeTable);

//Edit a registered Table
routes.use('/editTable',table.editTable);

//Get a registered Table
routes.use('/getATable',table.getATable);

//Get all registered Order
routes.use('/getAllOrders',order.getAllOrders);

//Add a new registered Order
routes.use('/addOrder',order.addNewOrder);

//Delete a registered Order
routes.use('/removeOrder',order.removeOrder);

//Edit a registered Order
routes.use('/editOrder',order.editOrder);

//Get all registered Inventory
routes.use('/getAllInventory',inventory.getAllInventory);

//Add a new registered Inventory
routes.use('/addNewInventory',inventory.addNewInventory);

//Delete a registered Inventory
routes.use('/removeInventory',inventory.removeInventory);

//Edit a registered Inventory
routes.use('/editInventory',inventory.editInventory);


//******************************End of API Calls*****************************************



// connect the api routes under /api/*
app.use('/api', routes);

// Start the server
app.listen(port);
var open = require('open');
open('http://localhost:3000', function(err) {
    if (err) throw err;
});
console.log('There will be dragons: http://localhost:' + port);