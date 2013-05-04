var CONF    = require('config'),
    express = require('express')
    app     = exports = module.exports = express();

var callbacks = require('./controllers');

app.use(callbacks.app);

app.get('/', callbacks.site.home);

