var express   = require('express'),
    validator = require('express-validator')
    poet      = require('poet')

exports = module.exports;

var app     = exports.app = express(),
    blog    = poet(app),
    handler = {};

var postsPerPage = CONF.poet.postsPerPage

blog.set({
  posts: path.join(CONF.app.rootdir, CONF.poet.postdir), // Post directory
  postsPerPage: postsPerPage,   // Posts per page in pagination
  metaFormat: 'json',             // Meta format for post head matter
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

validators.page = function(req, res, next) {
  req.assert('page', 'Invalid Page Number').isInt().min(1);
  var errors = req.validationErrors();
  if (errors) {
    res.send('500 Error ' + utils.inspect(errors));
  }
  next();
};

handler.root = function(req, res) {
  res.redirect('/blog/page/1');
};

handler.page = function(req, res) {
  // Figure out which posts to get
  var page      = req.params.page,
      lastPost  = page*postsPerPage,
      firstPost = lastPost - postsPerPage, 
      posts     = req.poet.getPosts(firstPost, lastPost);

  // Fill in the template parameters
  var context = {
    pageTitle: 'David Adrian | Blog Page ' + page,
    posts: posts
  };

  // Send the response
  if (posts.length) {
    res.render('blog', context);
  } else {
    res.send(('404', 404));
  }
};

blog.post = function(req, res) {
  var post = req.poet.getPost(req.params.post);
  if (post) {
    context = {
      pageTitle: post.title,
      post: post
    };
    res.render('post', context);
  } 
  res.send('404', 404);
};

app.configure(function() {
  app.use(validator);
  app.use(blog.middleware);
  app.use('/blog/page/:page', validators.page);
});

app.get('/blog', handler.root);
app.get('/blog/page/:page', handler.page);
app.get('/blog/post/:post', handler.post);

