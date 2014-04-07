var util      = require('util'),
    express   = require('express'),
    http      = require('http'),
    validator = require('express-validator')
    poet      = require('poet'),
    CONF      = require('config'),
    path      = require('path');

CONF.app.rootdir = __dirname;

// Import private libraries
var app    = express(),
    routes = require('./lib/routes');

// General global config of Express
app.set('views', path.join(CONF.app.rootdir, 'views'));
app.set('view engine', 'jade'); // I want to change this, probably ejs
if (process.env.NODE_ENV == 'development') {
	app.use(express.logger('dev'));
} else {
	app.use(express.logger());
}
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// Set up static serving for development
if (process.env.NODE_ENV == 'development') {
	app.use('/assets', express.static(path.join(CONF.app.rootdir, CONF.app.staticdir)));
}

// Set up the routes
app.use(routes);

// Start it up
var port = process.env.PORT || CONF.app.port
app.listen(port);
console.log('Express server listening on port ' + port);
