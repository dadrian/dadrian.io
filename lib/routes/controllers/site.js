exports = module.exports;

exports.home = function(req, res) {
	var posts = req.poet.getPosts(0, 2);
	var context = {
		pageTitle: 'David Adrian',
		posts: posts
	};
	res.render('index', context);
};

exports.projects = function(req, res) {
	var context = {
		pageTitle: 'David Adrian | Projects'
	};
	res.render('projects', context);
};

