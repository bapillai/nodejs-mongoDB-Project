var routes =  require('express').Router();
var auth = require('./auth');

routes.use('/auth',auth);

routes.get('/', function(req,res){
  res.send(200);
});

modules.exports = routes;
