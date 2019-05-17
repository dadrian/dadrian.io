---
title: "Heartbleed"
date: 2019-05-08T19:00:00-05:00
draft: false
---

The [Heartbleed vulnerability][heartbleed] is now five years old[^1].

> The Heartbleed bug allows anyone on the Internet to read the memory of the
> systems protected by the vulnerable versions of the OpenSSL software.

Heartbleed was a remotely-exploitable buffer overrun vulnerability that
exposed the contents of server memory. It allowed attackers to invisibly read
sensitive data from a web server. The bug itself has been written about
[ad][heartbleed-ars] [nauseam][nyt-pre-exploit], including a great explainer
on [XKCD][xkcd-heartbleed]. That's not what this post is about. At the time
Heartbleed was announced, I was just finishing my undergraduate degree at The
University of Michigan, and I was planning on staying at Michigan for
graduate school. I was working on [ZMap][zmap] with another graduate student
[Zakir Durumeric][zakir], and our advisor [Alex Halderman][alex]. Using ZMap,
we become the authoritative source for measurements about the impact of
Heartbleed, which we [posted online][zmap-heartbleed]. This is the story of
how to measure vulnerability to Heartbleed, how I was introduced to a New
York Times reporter as "undergrad", and my first Go program.

### TLS Banner Grab

ZMap performs a TCP synscan in 45 minutes using a single gigabit ethernet connection.

[^1]: Despite this, the [heartbleed.com][heartbleed] domain still doesn't have HTTPS. 🙄

[heartbleed]: http://heartbleed.com
[xkcd-heartbleed]: https://xkcd.com/1354/
[nyt-pre-exploit]: https://bits.blogs.nytimes.com/2014/04/16/study-finds-no-evidence-of-heartbleed-attacks-before-the-bug-was-exposed/
[heartbleed-ars]: https://arstechnica.com/information-technology/2014/04/researchers-find-thousands-of-potential-targets-for-heartbleed-openssl-bug/
[zmap]: https://zmap.io
[alex]: https://jhalderm.com
[zakir]: https://zakird.com
[zmap-heartbleed]: https://zmap.io/heartbleed
