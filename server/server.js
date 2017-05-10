// set up ======================================================================
// get all the tools we need
var express      = require('express');
var app          = express();
var port         = process.env.PORT || 5000;
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path         = require('path');
var server       = require('http').Server(app);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({limit:1024*1024*5000})); // get information from html forms
app.use(bodyParser.urlencoded({limit:1024*1024*5000,type:'application/*', extended: true, parameterLimit:500000 }));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: '10172009',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use("/barcodes",express.static(__dirname + "/barcodes"));
app.use("/static",express.static(__dirname + "/static"));

global.rootDir = path.resolve(__dirname);

// routes ======================================================================
require('./routes.js')(app, server);

// launch ======================================================================
server.listen(port);
console.log('The magic happens on port ' + port);
