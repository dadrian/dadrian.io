---
title: "Not post-quantum does not mean plaintext."
date: 2024-04-13T13:12:00-05:00
---

HTTPS adoption in 2024 is around [95-98\%][goog-https-transparency], as measured
by page loads in Chrome (it [would be better][chromium-https-default] if it was
100\%!). These days, a plaintext HTTP site is a rarity, enough that many users
of Chrome's "Always Use Secure Connections" mode, which presents a full-page
interstitial warning the user before accessing an HTTP page, see an average of
zero warnings per week.

But it didn't always used to be this way! HTTPS adoption was was below 50\% of
page loads in 2013. It is thanks to a concerted effort by many organizations
such as Let's Encrypt, Mozilla, the EFF, Cloudflare and Google; many academics
from Berkeley, the University of Michigan, and the University of Illinois; and
many individuals such as Andrew Ayer, Alex Gaynor, and Eric Mill that HTTPS has
become so widely adopted, to name a few[^1].

This is because for many years HTTPS was [difficult and expensive][https-cost]
to deploy, and [certificates were expensive and hard to get][chocolate].
Furthermore, people were not aware of the security downsides of using plaintext
HTTP. The prevalent idea in 2010 was that you only needed HTTPS for login pages.
This is how Facebook worked, until the [Firesheep extension][firesheep] exploded
in popularity on college campuses, pushing Facebook to deploy site-wide HTTPS.

Over the years, as people realized the risks, the costs decreased, and the ease
of the deployment increased (as of 2024, every major hosting provider supports
HTTPS by default except for GoDaddy), HTTPS adoption slowly increased to where
it is today.

The migration to post-quantum cryptography will be similar, but not the same.
The reason for this is twofold:
1. Post-quantum cryptography is simply not as cheap as current algorithms. As it
  stands in April 2024, most post-quantum cryptograph is [too damn
  big][pqc-too-damn-big].
1. The threat to web traffic is not (currently) the same.

\TODO


[^1]: This is a very incomplete list, and individuals who were part of the
  organizations listed above are purposefully excluded from the list of
  individuals.

[chocolate]: \TODO
[goog-https-transparency]: \TODO
[chromium-https-default]: \TODO
[pqc-too-damn-big]: \TODO
