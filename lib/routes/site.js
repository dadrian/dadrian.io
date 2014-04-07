var express = require('express');

var app = module.exports = express();

app.get('/', function(req, res) {
    var posts  = req.poet.getPosts(0, 2);
    context = {
      pageTitle: 'David Adrian',
      posts: posts
    };
    res.render('index', context);
});

app.get('/projects', function(req, res) {
    var context = {
        pageTitle: 'David Adrian | Projects'
    };
    res.render('projects', context);
});
