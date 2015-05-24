var CONF    = require('config'),
    express = require('express'),
    app     = module.exports = express();

var site = require('./site');

app.use(site);

console.log('Exporting routes/index.js');
