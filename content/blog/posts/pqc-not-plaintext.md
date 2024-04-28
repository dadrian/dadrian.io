---
title: "Lack of post-quantum security is not plaintext."
date: 2024-04-13T13:12:00-05:00
---

HTTPS adoption in 2024 is around [95-98\%][goog-https-transparency], as measured
by page loads in Chrome (it [would be better][chromium-https-default] if it was
100\%!). These days, a plaintext HTTP site is a rarity, enough that many users
of Chrome's "Always Use Secure Connections" mode, which presents a full-page
interstitial warning the user before accessing an HTTP page, see an average of
zero warnings per week.

But it didn't always used to be this way! HTTPS didn't even exist until after
Netscape was created. As recently as 2013, HTTPS adoption was still below 50\%
of page loads. HTTPS adoption is as high as it is today thanks to a concerted
effort by many organizations from academia and industry, as well as many
[non-profits][isrg]. This is because for many years HTTPS was difficult and
expensive to deploy, and [certificates were expensive and difficult to
obtain][chocolate]. Furthermore, many people were not aware of the security
downsides of using plaintext HTTP. The prevalent idea in 2010 was that you only
needed HTTPS for login pages. This is how Facebook worked until the [Firesheep
extension][firesheep] exploded in popularity on college campuses, pushing
Facebook to deploy site-wide HTTPS.

Over the years, as people realized the risks of plaintext, the costs of HTTPS
decreased, and the ease of the deployment increased, HTTPS adoption slowly
increased to where it is today. As of 2024, every major hosting provider
supports HTTPS by default except for GoDaddy.

The migration to post-quantum cryptography will be similar, but not the same.
The reason for this is twofold:
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
if people were previously more willing to accept the risk.

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
algorithms. Outside of the software signing use-case[^2], this risk is not
relevant until a CRQC actually exists, because impersonation is inherently
temporal. An attacker can't be in the middle of a conversation that has already
happened!

It's not possible to deploy new cryptographic signature schemes for the entire
Internet overnight, so even though we don't need post-quantum authentication
until a CRQC exists, we need to start early. But we also don't need to rush
things. We should consider the timelines and risk horizon for a CRQC when
deploying these schemes, and weigh the quantum risk relative to other risks to
the ecosystem during the deployment process.

Internet standards are only successful when they are widely deployable. This
requires an iterative design and standardization approach, informed by designers
and implementors. This approach is why TLS 1.3 was considerably more successful
than other versions of TLS in terms of adoption timeline and the relative lack of
protocol vulnerabilities.

The migration to post-quantum cryptography will be a long and difficult road,
which is all the more reason to make sure we learn from past efforts, and take
advantage of the fact the risk is not imminent. Specifically, we should avoid:
* Deploying algorithms pre-standardization in ways that can't be easily rolled
  back[^3]
* Standardizing solutions that match how things work currently, but have
  significant negative externalities (increased bandwidth usage and latency),
  instead of designing new things to mitigate the externalities
* Adding algorithms that are pre-standardization or have severe shortcomings to
  compliance frameworks

We are not in the middle of a [post-quantum emergency][ekr-qday], and nothing
points to a surprise "Q-Day" within the next decade. We have time to do this
right, and we have time for an iterative feedback loop between implementors,
cryptographers, and standards bodies.

The situation may change. It may become clear that quantum computers are coming
in the next few years. If that happens, the risk calculus changes and we can try
to shove post-quantum cryptography into our existing protocols as quickly as
possible. Thankfully, that's not where we are.

As it stands, the size of post-quantum cryptography makes the "copy-and-replace"
approach to deployment impractical. We are still on a timeline where we can have
our cake, and eat it, too. Let's not artificially inflate the quantum threat as
justification to deploy cryptographic algorithms that aren't practical or aren't
ready.


[^2]: Signatures over software (primarily firmware) are often long-lived and
  bound to the lifetime of a device. Signatures used to authenticate a
  communications channel are only relevant to that communication channel.
[^3]: As a practical note, a [browser][chrome-kyber] deploying
  _opportunistic_ post-quantum key exchange is quite easy to change or rollback
  due to how TLS performs cipher suite negotiation. Browsers can simply stop
  offering or change what key exchange methods they're offering, and it's only
  going to affect bleeding edge servers that have deployed post-quantum key
  exchange. However, browsers accepting post-quantum signatures in certificates
  would be basically impossible to undeploy, because certificates are valid for
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
