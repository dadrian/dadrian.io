var CONF    = require('config'),
    express = require('express'),
    app     = module.exports = express();

var blog = require('./blog');
var site = require('./site');

app.use(blog);
app.use(site);

console.log('Exporting routes/index.js');