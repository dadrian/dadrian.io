var express   = require('express'),
    validator = require('express-validator'),
    poet      = require('poet'),
    CONF      = require('config');

var app     = express(),
    blog    = poet(app);

var postsPerPage = CONF.poet.postsPerPage;

var validators = {},
    handlers   = {};

blog.set({
  posts: path.join(CONF.app.rootdir, CONF.poet.postdir), // Post directory
  postsPerPage: postsPerPage,   // Posts per page in pagination
  metaFormat: 'json',             // Meta format for post head matter
  routes : {
    post : '/blog/post/:post',
    page : '/blog/page/:page',
    tag : '/blog/tag/:tag',
    category : '/blog/category/:category'
  },
  readMoreLink: function(post) {
    var anchor = '<a href="' + post.url + '" title="Read more of ' +
        post.title + '"> ...read more</a>';
    return '<p>' + anchor + '</p>';
  },
  readMoreTag: '<!--more-->'
}).init(function(locals) {
  locals.postList.forEach(function(post) {
    post.authority = CONF.app.base_url;
  });
});

validators.page = function(req, res, next) {
  req.assert('page', 'Invalid Page Number').isInt().min(1);
  var errors = req.validationErrors();
  if (errors) {
    res.send('500 Error ' + utils.inspect(errors));
  }
  next();
};

handlers.root = function(req, res) {
  res.redirect('/blog/page/1');
};

handlers.page = function(req, res) {
  // Figure out which posts to get
  var page      = req.params.page,
      lastPost  = page*postsPerPage,
      firstPost = lastPost - postsPerPage,
      posts     = req.poet.getPosts(firstPost, lastPost);

  // Fill in the template parameters
  var context = {
    page: page,
    pageTitle: 'David Adrian | Blog Page ' + page,
    posts: posts
  };

  // Send the response
  if (posts.length) {
    res.render('blog', context);
  } else {
    res.send(404, '404');
  }
};

handlers.post = function(req, res) {
  var post = req.poet.getPost(req.params.post);
  if (post) {
    context = {
      pageTitle: post.title,
      post: post
    };
    res.render('post', context);
  } else {
    res.send(404, '404');
  }
};

app.use(validator);
app.use(blog.middleware());
app.use('/blog/page/:page', validators.page);

app.get('/blog', handlers.root);
app.get('/blog/page/:page', handlers.page);
app.get('/blog/post/:post', handlers.post);

console.log('Exporting blog.js');

exports = module.exports = app;
