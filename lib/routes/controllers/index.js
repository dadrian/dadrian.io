exports = module.exports;

module.exports.site = require('./site');
module.exports.blog = require('./blog');
module.exports.app = module.exports.blog.app;