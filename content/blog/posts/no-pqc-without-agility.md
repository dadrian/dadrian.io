---
title: "There will be no post-quantum PKI without agility"
date: 2024-07-22T10:58:00-04:00
---

Post-quantum cryptography is [big, and therefore slow][pqc-too-damn-big]. The
threat from a cryptographically-relevant quantum computer (CRQC) is [less
urgent][advancing-asymmetric-bet] for authentication (PKI) than it is for key
exchange. Combined, this means that post-quantum adoption [lacks as strong of a
motivation as HTTPS adoption][pqc-not-plaintext].

Let's consider a world where ML-DSA is standardized for use in X.509
certificates by the IETF, and then standardized for trust in browsers via the
CA/Browser Forum (CABF). At this point, site operators would then have a choice
between the currently available and broadly compatible RSA certificate chains
with roughly 1Kb of cryptographic material, currently available but less widely
compatible ECDSA chains with roughly 0.1Kb cryptographic material, and the all-new
ML-DSA chains with roughly 7.5Kb of cryptographic material[^1].

At this point, site operators will need to make several decisions:
- Should they acquire a pre-quantum certificate?
- Should they acquire a post-quantum (ML-DSA) certificate?
- If they get an ML-DSA certificate, who should they serve it to?
- If they get an ML-DSA certificate, what CA should they get it from?

Given that a quantum computer does not exist, sites will want to keep
pre-quantum certificates to remain broadly compatible with clients. However,
there will also be a performance incentive to stay with pre-quantum---the
certificates are much smaller and therefore TLS handshakes will be considerably
quicker with pre-quantum than post-quantum cryptography. There's no security
threat from a _future_ quantum computer to authentication, so sites can maintain
security by waiting to switch to a post-quantum certificate until a
cryptographically-relevant quantum computer (CRQC) actually exists.

However, there may be external pressures to acquire a post-quantum certificate
prior to a CRQC existing. This may be due to regulatory/compliance pressure for
certain verticals, general preparedness, or for compatiblity with some future
post-quantum only clients.

So we should expect that until a CRQC actually exists, most site operators will
choose to continue to only use pre-quantum certificates, and some may choose to
get both a pre-quantum and a post-quantum certificate.

Let's consider the site operators with both a pre-quantum and a post-quantum
certificate. When should they use the post-quantum certificate? Given how TLS
currently works, there are only three options:

1. Serve it to nobody
2. Serve it to all clients who indicate support for the ML-DSA signature
   algorithm.
3. Serve it clients who indiciate support ML-DSA, but don't indicate support
   ECDSA or RSA.

Option 1 is effectively a no-op---it doesn't hurt anyone to have a certificate
you're not using, but why bother? Option 2 and Option 3 get more interesting.
The server knows if the client supports a specific signature algorithm, but
doesn't know if the client trusts the root actually used to issue that
certificate. If you're a server, you don't know which root store the client is
using, and so you don't know if the ML-DSA certificate you acquired is actually
trusted by that client. This is a problem for pre-quantum, but one that most
people don't see because after 10-20 years of HTTPS, root stores settled on a
fairly large intersection of RSA root certificates that are broadly trusted.
However, ML-DSA root certificates will be new, and servers won't be able to
count on a broad set of clients having the same roots. Similarly, even across a
single client, they might not know what version of the root store is in use,
Imagine ML-DSA Root A was addeded to Client X in Version 1, and then ML-DSA Root
B was added to Client X in Root Store Version 2, however Client Y adds ML-DSA
Root B in Root Store Version 1, and never adds Root A. A single certificate
cannot cover all versions of both clients. Even if the server can detect Client
X vs Client Y, it has no way of knowing if Client X has Root Store Version 1 or
Version 2.

Option 2 is inherently a gamble until clients have broad adoption of the same
set of ML-DSA roots. If a client doesn't actually trust the CA that the server
used to acquire its ML-DSA certificate, that client will fail to authenticate the
server and likely display a certificate error to the user. This risk isn't
particularly palatable to site operators, and so they'd be better off simply not
using an ML-DSA certificate, unless the client _only_ offers ML-DSA as its sole
supported signature algorithm (never mind the fact that such a client doesn't
actually exist). At that point, the server has no other option beyond to gamble
that the client trusts the CA that issued the ML-DSA certificate presented by
the server.

Agreeing that one field in an open protocol means something additional than what
it is defined to mean is a process known as _ossification_, a term stolen from
biology that refers to bones getting stuck in a fixed relative position, i.e. a
frozen joint. This is generally considered to be a [bad
thing][protocol-ossification] because it prevents the inferred state from
changing without some new way of signaling, _and_ it prevents the ossified field
from changing as needed for its original purpose, because the field now has two
purposes.

Under Option 2, without changing the TLS protocol, the "best" possible outcome
for predictable compatibility is that _somehow_ everyone waits for some amount
of time, and then loosely agrees that offering the ML-DSA signature algorithm is
equivalent to stating that some minimum set of CAs are included in your root
store. Ossification, but hope its very demure, very mindful.


Option 3 is unrealistic because there are no clients that _only_ speak ML-DSA.
NIST is currently targeting 2035 as the cutoff to switch to fully post-quantum
cryptography. Browsers will not be removing ECDSA and RSA any time soon. But
_if_ ML-DSA certificates existed, and _if_ such a client existed, it would be
both straightforward, and _literally the only option for the server_, to serve
an ML-DSA certificate to these clients.

So given all this, what would we expect to happen with a slow introduction of
new ML-DSA roots?

- Clients would add support for the algorithm
- Servers facing regulatory pressure would adopt both pre-quantum and
  post-quantum certificates
- Servers would be incentivized to _never_ use the post-quantum certificates due
  to the performance impact and compatibility concerns

Is it really that bad if we standardize workable, but expensive, post-quantum
certificates, and nobody uses them until the threat is real? If we believed that
everyone would get a "hot spare" post-quantum certificate, perhaps not. Why take
the performance hit until absolutely necessary, especially if [defenses against
store-now decrypt-later are already deployed][chrome-ml-kem]?

Unfortunately, that's also a bit of a pipe dream. Some sites will want to
actually use post-quantum certificates before a CRQC exists, and they will want
to do so in a way that maximizes compatibility. These sites will be in a rock
and hard place, if they also care about performance.

In practice, we'd still end up at:

- Eventually, the signature_algorithm field may ossify into additionally
  implying something about the state of the trust store.

The good news is that given the incentives to never actually serve the ML-DSA
certificate if you can avoid it, ossification probably won't take place for a
while. No one will want to take the performance hit of migrating to post-quantum
authentication, and so no one will choose to actually use ML-DSA certificates
for real connections. Performance hits are much more palatable when the
alternative is actually "no security", rather than ["no security against a
threat that doesn't exist, but might in the future"](/no-pqc-without-agility).

So, how do we avoid ossification and provide a better path to deployment?

[^1]: This assumes the existence of a single intermediate certificate shipped
  with the leaf certificate, and a single algorithm per chain. Each cert would
  have one key and one signature. RSA is a 2048-bit key and signature on both.
  ECDSA is a 32-bit key and 64-bit signature. ML-DSA is 2,420 byte signatures
  and 1,312-byte keys. A hybrid ECDSA-leaf-RSA-intermediate chain
  would be around 0.6Kb of cryptographic material.

[pqc-too-damn-big]: https://dadrian.io/blog/posts/pqc-signatures-2024/
[advancing-asymmetric-bet]: https://blog.chromium.org/2024/05/advancing-our-amazing-bet-on-asymmetric.html
[pqc-not-plaintext]: https://dadrian.io/blog/posts/pqc-not-plaintext/
[chrome-ml-kem]: https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html
