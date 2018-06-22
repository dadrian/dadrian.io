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
    res.redirect('/cv');
});

app.get('/cv', function(req, res) {
    var context = {
        pageTitle: 'David Adrian | CV'
    };
    res.render('resume', context);
});

app.get('/blog', function(req, res) {
    res.redirect('https://blog.davidadrian.org');
});

app.get('/blog/post/heartbleed', function(req, res){
    res.redirect('https://blog.davidadrian.org/tracking-heartbleed/')
});

app.get('/blog/post/281mac', function(req, res) {
    res.redirect('https://blog.davidadrian.org/developing-on-a-mac-in-eecs-281/')
});

app.get('/blog/post/duounix', function(req, res) {
    res.redirect('https://blog.davidadrian.org/shout-out-by-duo-security/')
});
