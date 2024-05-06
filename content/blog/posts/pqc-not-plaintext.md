---
title: "Lack of post-quantum security is not plaintext."
date: 2024-05-06T11:24:00-04:00
---

HTTPS adoption in 2024 is around [95-98\%][goog-https-transparency], as measured
by page loads in Chrome (it [would be better][chromium-https-default] if it was
100\%!). These days, a plaintext HTTP site is a rarity, enough that many users
of Chrome's "Always Use Secure Connections" mode, which presents a full-page
interstitial warning the user before accessing an HTTP page, see an average of
zero warnings per week.

But it didn't always used to be this way! HTTPS didn't even exist until after
Netscape was created. As recently as 2013, HTTPS adoption was still below 50\%
of page loads. In 2010, the prevalent idea was still that HTTPS was only
required for login pages to protect passwords, and not the rest of the site,
even though this leaks the session cookie. Facebook first deployed site-wide
HTTPS in 2010 after the [Firesheep extension][firesheep] exploded in popularity
on college campuses. Firesheep leveraged the lack of confidentiality for session
cookies to enable anyone to steal them from other users on the same wifi.

Over the years, HTTPS adoption slowly increased as people realized the risks of
plaintext, and HTTPS got easier and cheaper to deploy, eventually reaching where
it is today. As of May 2024, every major hosting provider supports HTTPS by
default except for GoDaddy.

HTTPS is at risk from future quantum computers, which will be able to break all
of the asymmetric cryptography standardized for use in HTTPS. This is the
motivation for the development and deployment of _post-quantum cryptography_,
which is cryptography that can be used by traditional computers, but is
resistant to cryptanalysis by quantum computers.

Migrating HTTPS to post-quantum cryptography will be similar, but not the same,
as the migration from plaintext HTTP to HTTPS. The reason for this is twofold:
1. Post-quantum cryptography is simply not as cheap as current algorithms. As it
  stands in April 2024, most post-quantum cryptography is [too damn
  big][pqc-too-damn-big].
1. The threat to web traffic from quantum computers is not the same as the risks
  from plaintext.

In 2024, the threat of plaintext should be obvious. Sessions can be stolen,
passwords can be sniffed, sites can be impersonated, and content can be injected
into plaintext sessions. This has always been the case for plaintext. It is not
a new risk. If you are a site operator and you do not deploy HTTPS, you are
actively harming your users and yourself. This _has always been the case_, even
if people were previously more willing to accept the risk. At first, only
ecommerce sites thought the risk was high enough to mitigate. Then sites with
login pages. Then any site with a session. And eventually, even sites serving
static public content no longer accepted the risk of plaintext.

This is very different from the [threat of quantum computers][google-pqc-threat]
because a cryptographically-relevant quantum computer (CRQC) _does not currently
exist_. It also may never exist! We don't know.

What we do know is that it is [exceedingly unlikely][nas-qc-timeline] that
anyone will be able to develop a CRQC without it being clearly visible on the
horizon several years out. The idea that one day we will wake up and suddenly
all asymmetric cryptography is broken with no warning is not realistic.

Instead, we have two _potential_ threats, only one of which affects current
traffic.

1. The "store now, decrypt later" attack (SNDL) poses a risk to current traffic
that is recorded, but only on the same timescale of the development of a CRQC
(which again, might never happen).
2. The threat of impersonation and MITM once a CRQC _actually exists_.

Mitigating SNDL requires deploying post-quantum key exchange algorithms.
However, not deploying post-quantum key exchange still only _potentially_
(because a CRQC might never exist) affects current traffic _in the future_
(because a CRQC does not yet exist). This is different than "plaintext in the
90s", because the plaintext presented an _active_ risk and affected current
traffic _at that time_, even though that risk was often ignored.

Mitigating impersonation and MITM requires deploying post-quantum signature
algorithms. For secure channels[^2], the risk of impersonation is not relevant
until a CRQC actually exists, because impersonation is inherently temporal. A
future attacker can't be in the middle of a conversation that took place in the
past.

It's not possible to deploy new cryptographic signature schemes for the entire
Internet overnight, so even though we don't need post-quantum authentication
until a CRQC exists, we need to start early. But we also don't need to rush
things. We should consider the timelines and risk horizon for a CRQC when
deploying these schemes, and weigh the quantum risk relative to other risks to
the ecosystem during the deployment process.

The push to increase HTTPS adoption was not an oversight success, nor was it
solely a communication effort to make people aware of the security risks of
plaintext HTTP. HTTPS adoption is as high as it is today thanks to a concerted
effort by many organizations from academia, government, and industry, as well as
many [non-profits][isrg]. This is because for many years HTTPS was difficult and
expensive to deploy, [certificates were expensive and difficult to
obtain][chocolate], and performance was a valid concern.

It took research and development to address these concerns. Let's Encrypt was
founded to make it easy and free to get an HTTPS certificate.  New ciphers and
cipher modes like AES-GEM and ChaCha-Poly1305 made encryption-in-transit much
cheaper. New key exchange methods like X25519 made perfect forward secrecy
cheaper and easier to implement. Other performance improvements like HTTP/2 were
coupled to deploying HTTPS. Eventually, TLS was nearly entirely reworked for TLS
1.3, and is faster and more secure than TLS 1.2.

The success of HTTPS and TLS 1.3 tells us that Internet standards are only
successful when they are widely deployable. This requires collaboration between
both designers and implementors, and an iterative design and standardization
approach, informed by real-world experimentation. This approach is why TLS 1.3
was considerably more successful than other versions of TLS in terms of adoption
timeline and the relative lack of protocol vulnerabilities.

The migration to post-quantum cryptography will be a long and difficult road,
which is all the more reason to make sure we learn from past efforts, and take
advantage of the fact the risk is not imminent. Specifically, we should avoid:
* Standardizing without real-world experimentation
* Standardizing solutions that match how things work currently, but have
  significant negative externalities (increased bandwidth usage and latency),
  instead of designing new things to mitigate the externalities
* Deploying algorithms pre-standardization in ways that can't be easily rolled
  back[^3]
* Adding algorithms that are pre-standardization or have severe shortcomings to
  compliance frameworks

We are not in the middle of a [post-quantum emergency][ekr-qday], and nothing
points to a surprise "Q-Day" within the next decade. We have time to do this
right, and we have time for an iterative feedback loop between implementors,
cryptographers, standards bodies, and policymakers.

The situation may change. It may become clear that quantum computers are coming
in the next few years. If that happens, the risk calculus changes and we can try
to shove post-quantum cryptography into our existing protocols as quickly as
possible. Thankfully, that's not where we are.

As it stands, the size of post-quantum cryptography makes the "copy-and-replace"
approach to deployment impractical. We are still on a timeline where we can have
our cake, and eat it, too. Let's make sure we learn from the past by not
artificially inflating the quantum threat as justification to deploy
cryptographic algorithms that aren't practical or aren't ready. Not only is that
bad for the Internet, but it won't work.

[^2]: Other authentication use cases may have different threat models.
  Signatures over software (primarily firmware) are often long-lived and bound
  to the lifetime of a device, whereas signatures used to authenticate a
  communications channel are only relevant to that communication channel. For a
  breakdown of how this plays out in HTTPS, see [my other blog
  post][pqc-too-damn-big].
[^3]: As a practical note, a [browser][chrome-kyber] deploying
  _opportunistic_ post-quantum key exchange is quite easy to change or rollback
  due to how TLS performs cipher suite negotiation. Browsers can simply stop
  offering or change what key exchange methods they're offering, and it's only
  going to affect bleeding edge servers that have deployed post-quantum key
  exchange. However, browsers accepting post-quantum signatures in certificates
  would be basically impossible to roll back, because certificates are valid for
  [a long time][dadrian-strangeloop-lifetimes].

[chocolate]: https://dl.acm.org/doi/pdf/10.1145/3319535.3363192
[goog-https-transparency]: https://transparencyreport.google.com/https/overview
[chromium-https-default]: https://blog.chromium.org/2023/08/towards-https-by-default.html
[pqc-too-damn-big]: https://dadrian.io/blog/posts/pqc-signatures-2024/
[nas-qc-timeline]: https://nap.nationalacademies.org/catalog/25196/quantum-computing-progress-and-prospects
[ekr-qday]: https://educatedguesswork.org/posts/pq-emergency/
[isrg]: https://www.abetterinternet.org/
[firesheep]: https://en.wikipedia.org/wiki/Firesheep
[google-pqc-threat]: https://bughunters.google.com/blog/5108747984306176/google-s-threat-model-for-post-quantum-cryptography
[dadrian-strangeloop-lifetimes]: \TODO
[chrome-kyber]: https://blog.chromium.org/2023/08/protecting-chrome-traffic-with-hybrid.html
