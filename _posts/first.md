{{{
  "title" : "Why?",
  "tags"  : [ "blog", "about", "learning", "node", "poet", "javascript" ],
  "category" : "about",
  "date" : "1-28-2013",
  "description" : "Rationale behind the site",
  "id": 0
}}}

You may be wondering why someone would choose to write their own blog system in Node.js. It seems like a lot of work. And since this blog is mostly static (at time of launch, it doesn't have comments, accounts, etc.), why not use something like Jekyll? Isn't this blog incredibly over-engineered?

The short answer: Yes it is.

<!-- more -->

The long answer: Yes, but it's for a decent reason. I'll be the first to admit, I don't know Javascript that well. When I started this project, the extent of my knowledge of Node and Express was a forty-five minute presentation by one of the founders of [Doodle or Die](http://www.doodleordie.com), and davidadrian.org was just a single static webpage. My knowledge of CSS was limited to using Bootstrap. My site was just the Bootstrap example page, with a couple filled-in sentences about me, and a listing of my contact info.

I'd like to think that this version of the site is a bit nicer, even if it only has a couple more features. Now that the initial version is built, it's certainly nice for me to able to post blog entries using Git, rather than FTP. And I had fun making it. Maybe in the future I'll convert over to Jekyll, but for now I'm going to relish in my first (albeit simple) Node + Express webapp.

There are many static-content blogging frameworks. But this one is mine. And when I made it, I learned something new. That's good enough for me. If you're interested, the code is [on Github](http://github.com/dadrian/davidadrian-website).

*Note: I did take advantage of the [Poet](http://jsantell.github.com/poet) blog generator for rendering the posts and post previews, but I handled the routing myself.*
