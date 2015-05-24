var express = require('express');

var app = module.exports = express();

app.get('/', function(req, res) {
    context = {
      pageTitle: 'David Adrian',
      posts: [],
    };
    res.render('index', context);
});

app.get('/resume', function(req, res) {
    var context = {
        pageTitle: 'David Adrian | Resume'
    };
    res.render('resume', context);
});

app.get('/blog', function(req, res) {
    res.redirect('https://blog.davidadrian.org');
});
