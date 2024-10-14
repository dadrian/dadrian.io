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
CA/Browser Forum (CABF). Site operators would then be able to acquire broadly
compatible RSA certificate chains roughly 2Kb in size, ECDSA chains roughly 1Kb
in size, and ML-DSA chains roughly 7Kb in size.

At this point, site operators will need to make several decisions:
- Should they acquire a pre-quantum certificate?
- Should they acquire an ML-DSA certificate?
- If they get an ML-DSA certificate, what CA should they get it from?
- If they get an ML-DSA certificate, who should they serve it to?




[pqc-too-damn-big]: \TODO
[advancing-asymmetric-bet]: \TODO
[pqc-not-plaintext]: \TODO
