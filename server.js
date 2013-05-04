var util      = require('util'),
    express   = require('express'),
    validator = require('express-validator')
    poet      = require('poet'),
    CONF      = require('config'),
    path      = require('path');

var app   = express(),
    blog  = poet(app);

blog.set({
  posts: path.join(__dirname, CONF.poet.postdir), // Post directory
  postsPerPage: 5,              // Posts per page in pagination
  metaFormat: 'json',           // Meta format for post head matter
  routes : {
    post : '/blog/post/:post',
    page : '/blog/page/:page',
    tag : '/blog/tag/:tag',
    category : 'blog/category/:category'
  },
  readMoreLink: function(post) {
    var anchor = '<a href="' + post.url + '" title="Read more of ' + 
        post.title + '"> ...read more</a>';
    return '<p>' + anchor + '</p>';
  },
  readMoreTag: '<!--more-->'
}).init(function(locals) {
  locals.postList.forEach(function(post) {
    console.log(post);
  });
});

app.configure(function() {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(validator);
  app.use(blog.middleware());
})


app.get('/', function(req, res){
  var posts = req.poet.getPosts(0, 2);
  res.render('index', {pageTitle: 'David Adrian', posts: posts});
});

app.get('/blog', function(req, res) {
  res.redirect('/blog/page/1');
});

app.get('/blog/page/:page', function(req, res) {
  req.assert('page', 'Invalid Page Number').isInt().min(1);
  var errors = req.validationErrors();
  if (errors) {
    res.send('500 Error ' + util.inspect(errors), 500);
  }
  var page      = req.params.page,
      lastPost  = page * blog.postsPerPage,
      firstPost = lastPost - blog.postsPerPage,
      posts     = req.poet.getPosts(firstPost, lastPost);
  if (posts.length) {
    res.render('blog', {
      pageTitle: 'David Adrian | Blog Page ' + page,
      posts: posts
    });
  } else {
    res.send('404', 404);
  }
});

app.get('/blog/post/:post', function(req, res) {
  var post = req.poet.getPost(req.params.post);
  if (post) {
    res.render('post', {
      pageTitle: 'Post',
      post: post
    });
  }
  res.send('404', 404);
});

app.get('/projects', function(req, res) {
  res.render('projects', {pageTitle: 'David Adrian | Projects'});
});

app.listen(CONF.app.port);
console.log('Express started on port ' + CONF.app.port);
