var util      = require('util'),
    express   = require('express'),
    validator = require('express-validator')
    poet      = require('poet'),
    path      = require('path');

var app   = express(),
    blog  = poet(app);

blog.set({
  posts: __dirname + '/_posts',
  postsPerPage: 5,     // Posts per page in pagination
  metaFormat: 'json'  // meta formatter for posts
}).init();

blog.postsPerPage = 5;


app.configure(function() {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(validator);
  app.use(blog.middleware());
})


app.get('/', function(req, res){
  res.render('index', {pageTitle: 'David Adrian'});
});

app.get('/blog', function(req, res) {
  var posts = req.poet.getPosts(0, blog.postsPerPage);
  console.log(posts);
  res.render('blog', { 
    pageTitle: 'David Adrian | Blog', 
    posts: posts 
  });
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

app.listen(3000);
console.log('Express started on port 3000');
