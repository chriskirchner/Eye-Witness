/*
 Author: False Eye Witness Team
 Organization: OSU
 Class: CS361 Software Engineering 1
 Assignment: Project B - False Eye Witness Vision
 Purpose: server-side code for Eye Witness Lineup the right way
 */

//setup modules
var mysql = require('mysql');
var users = require('./routes/users.js');
var admins = require('./routes/admins.js');
var path = require('path');

//setup express with handlebars
var express = require('express');
var expressHandlebars = require('express-handlebars');
var app = express();
var handlebars = expressHandlebars.create(
    {defaultLayout: 'main'}
);

//setup settings for express handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//needed for integration testing
app.set('views', path.join(__dirname, 'views'));
app.set('layoutsDir', path.join(__dirname, 'views/layouts'));

//setup sessions to track user
var session = require('express-session');
app.use(session({secret:'SuperSecretPassword'}));

//set port (port last designated on cloud9)
app.set('port', 8080);

//setup parsing of POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//setup public directory for css, scripts, images
app.use(express.static('public'));

//specify user routes
app.use('/', users);
app.use('/get-suspects', users);
app.use('/next-suspect', users);
app.use('/choose-suspect', users);
// app.use('/make-database', users);

//specify admin routes
app.use('/make-database', admins);

//not found page
app.get('/', function(req, res){
  res.status(404);
  res.render('404');
});

//server error page
app.get('/', function(err, req, res, next){
  console.log(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

// var server = app.listen(app.get('port'), function(){
//    console.log("Started server on http://eye-witness_nodejs.c3c2oh.c9users.io/; Enter Ctrl-C to terminate");
// });

//export as module and serve using server.js
module.exports = app;