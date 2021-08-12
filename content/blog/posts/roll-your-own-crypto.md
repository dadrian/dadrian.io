---
title: "Roll your own crypto, then smoke it."
date: 2021-08-12T10:56:00-06:00
---

The July 31st, 2021 episode of the [Security, Cryptography, Whatever
podcast][scw] was the great "roll your own crypto"[^1] debate between [Thomas
Ptacek][tqbf] and [Filippo Valsorda][filo], moderated by [Deirdre
Connolly][deirdre], with additional commentary provided by me. Loosely, Filippo
was arguing that the mantra of "don't roll your own crypto" has been ineffective
and mostly serves as a form of gatekeeping in which the people the phrase is
targeted at don't listen to it anyway. Thomas was arguing that while that may be
true, things could always be worse. I don't want to summarize the whole episode,
so if you're interested in more detail, [take a listen][scw] or read the
[automatic transcript][transcript].

Without taking a real stand in the debate, I'd like to provide some more context
about how I interpret the phrase "don't roll your own crypto". For context, my
background is split between academia and industry with a bent towards
cryptography. My [PhD thesis][thesis] was on Internet-wide measurement of
cryptography in network protocols, primarily HTTPS. In industry, I've primarily
worked on data engineering problems surrounding Internet measurement, and on
secure protocol engineering, with a nice mix of management and general B2B SaaS
software engineering.

I agree with Thomas Ptacek when he said that "don't roll your own crypto" means
that any system with a serious cryptographic component should have consistent
design input and review from "actual cryptographers". This doesn't mean that you
can't write code that calls AES unless you have a PhD. On the flip side, it also
doesn't mean that people with PhDs in cryptography should be writing code that
calls AES. As Deirdre Connolly said, plenty of the cryptographic code written by
"serious cryptographers" with PhDs is a mess for both cryptographic and software
engineering related reasons.

Who counts as a cryptographer? That's the tough part. The "don't roll your own
crypto" messaging can make qualified people think that they shouldn't work on
cryptography because they've never been officially blessed by a magical
authority to deem them an actual cryptographer. There's people who I consider to
be cryptographers who don't have any degrees, let alone PhDs. Graduate school
isn't a requirement, but it certainly can be part of a path to becoming a
cryptographer. Cryptography is also a broad enough field that you could be
perfectly competent at understanding and implementing certain things, and not
others. I consider myself reasonably competent at working with secure
transports, PKI, identity, and authentication, but I know almost nothing about
zero-knowledge proofs or post-quantum cryptography.

I'm not an authority on who counts as a cryptographer, but if I were hiring
cryptographers or evaluating myself when offering consulting services, I'd
expect anyone qualified to roll their own cryptography to:
  - Be substantially engaged with the cryptographic community for multiple
    years, and to have worked with well-known or academically rigorous
    cryptographic constructs for some time.
  - Have worked with other "actual cryptographers" in the past.
  - Be able to use commonly accepted cryptography terminology to describe the
    properties of their system.
  - Understand enough of the math to know what enables any of these properties
    in the first place.
  - Understand attacks on similar cryptosystems, and when they do or do not
    apply.
  - Understand the layer they are operating at, and enough about the layer
    underneath to know when to be scared.
  - Know the limits of their own understanding, and have a list of people they
    would contact when they push up against topics outside their core wheelhouse
    and need to learn more or get advice on a particular problem.

Working on any specific subfield or at any specific abstraction level will have
its own set of expected knowledge. If you're designing hash functions and block
ciphers, I expect you to understand differential cryptanalysis. If you're
implementing TLS, I don't care if you know anything about the internals of
AES-GCM, so long as you know what it does and what happens when you reuse a
nonce. Similarly, many security engineers who aren't cryptography-focused are
qualified to use libraries to verify authentication tokens, even if they
wouldn't be qualified to implement TLS.

How do you learn all this stuff? Like any niche field, it's very opaque until it
isn't. I think there's more resources online for practical and applied
cryptography now than there were 5-10 years ago. Coursera is still a great place
to start, and [Dan Boneh's book][book], while unfinished, is more complete than
it was and still available for free online. You can find talks and blog posts by
authors of most cryptographic libraries for major languages online. The [Real
World Cryptography][rwc] conference is a great place to meet people and learn
about what's being built, not just what's happening to the theory. As always,
the [Cryptopals][cryptopals] challenges are a great place to start.

In summary, don't roll your own crypto. Build it for someone else, and charge a lot of money[^2]. It's hard!

[^1]: https://twitter.com/yolocrypto/status/361197131580719105
[^2]: https://twitter.com/Pinboard/status/1421645460410822656

[scw]: https://securitycryptographywhatever.com
[tqbf]: https://twitter.com/tqbf
[filo]: https://twitter.com/FiloSottile
[deirdre]: https://twitter.com/durumcrustulum
[transcript]: https://securitycryptographywhatever.buzzsprout.com/1822302/8953842-the-great-roll-your-own-crypto-debate-feat-filippo-valsorda
[cryptopals]: https://cryptopals.com/
[thesis]: https://dadrian.io/srv/papers/david-adrian-dissertation.pdf
[book]: http://toc.cryptobook.us/
[rwc]: https://rwc.iacr.org/
