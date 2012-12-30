var express = require('express'),
    poet    = require('poet');

var app   = express(),
    blog  = poet(app);

blog.set({
  posts: __dirname + '/_posts',
  postsPerPage: 5,     // Posts per page in pagination
  metaFormat: 'json'  // meta formatter for posts
}).createPostRoute()
  .createPageRoute()
  .createTagRoute()
  .createCategoryRoute()
  .init();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static( __dirname + '/assets'));

app.get('/', function(req, res){
  res.render('index', {pageTitle: 'Hello Title!'});
});

app.listen(3000);
console.log('Express started on port 3000');
