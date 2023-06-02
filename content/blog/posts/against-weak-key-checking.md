---
title: "Against Weak Key Checking"
date: 2023-06-01T05:05:00-06:00
---

_Certification authorities_ (CAs) are the entities responsible for validating
domain control and issuing the certificates used for HTTPS. The _Baseline
Requirements_ (BRs) are technical and policy requirements that govern
certification CA behavior, compliance with the BRs is "verified" by external
auditors. _Root programs_ require compliance with the BRs. Root programs are
ran by certificate consumers that maintain root stores, such as Mozilla, Apple,
Microsoft, and Chrome, require compliance with the BRs. The BRs are maintained
by the _CA/Browser Forum_ (CABF).

CAs are currently [required by the BRs][br-weak-keys] to reject issuance
requests if they are made aware of a demonstrated or proven method that can
easily compute the Applicant’s Private Key[^1]. In practice, this means that
CAs are supposed to reject requests for certificates where the private key is
vulnerable to [ROCA][roca] or [Debian Weak Keys][debian-weak-keys]. There is
currently a [CABF ballot][sc59] to codify this checking even further.

At first glance, this seems reasonable---we should try to keep a high bar for
security in the web PKI, and CAs are a natural place to enforce rules about
keys. However, let’s unpack this a little bit.

Debian Weak Keys was a vulnerability in OpenSSL on Debian Etch and Lenny around
2006-2009, resulting in only a small number of predictable private keys being
generated across all installs. The Web PKI and Internet security looked very
different 15 years ago, in 2008, than it does now. HTTPS was nearly
non-existent, used primarily for accepting credit card information. Automated
certificate issuance via ACME did not exist, let alone modern extensions to
ACME such as ARI, which allow a CA to notify subscribers that they should renew
a certificate earlier than expected. The term “bug bounty” wasn’t in use, and
very few websites had security disclosure processes. It made sense to mitigate
the vulnerability at the CA level at the time.

That being said, here's a non-exhaustive list of some of the other ways you can
generate weak keys:
* RSA primes too close (Fermat factorization)[^2]
* RSA moduli has one small factor
* GCD factorization
* Elliptic curve parameter not on curve
* Generating groups that result in small subgroups for Diffie-Hellman and certain elliptic curve implementations
* General randomness issues (e.g. shared VM images)
* Cross-organization key reuse
* Keys that have been revealed due to repeated nonces in signatures

Many of these weak keys require some sort of global view to detect. For
example, [GCD factorization works best][ps-and-qs] when you have access to all
RSA keys at the same time, and can multiply their moduli together.

Even with the multitude of ways key generation can fail, nowadays [we’re much
better at managing randomness and key generation][linux-csprng] than we were in
2008 or 2012. We have key types that definitionally must be valid so long as
they are minimally and properly encoded, and where key generation is as simple
as reading 32 random bytes. The randomness APIs on operating systems behave
much smarter than they did in 2012. And we have enough compute capacity and
automation that every certificate and host can use different keys.

At this point, there is no reason for _subscribers_ (users who are issued a
certificate by a CA) to be generating weak keys, unless they go out of their
way to have an insecure setup. At the same time, if another ROCA happens, and
the best course of action is to revoke and reissue a large set of certificates,
the mitigation for that is not better pre-issuance weak key checks. Automating
validation and reissuance allows for mass reissuance events to happen easily
throughout the ecosystem. Reducing certificate lifetimes reduces the exposure
of a compromised key or misissued certificate, especially for the vast majority
of clients that do not have access to complete revocation data.

Every time [someone][hanno] finds a new way to trick a certification authority
into issuing a weak key that violates the baseline requirements, CAs and root
programs participating in the CAB Forum are obligated to treat it as a formal
incident. This is a massive waste of time, for something that effectively has
no security impact on the web as a whole, beyond the subscriber who made the
weak key itself. CAs are not able to check for all types of weak keys, so the
onus of not generating a weak key is already on the subscriber, even in the
presence of the existing checks performed by CAs.

CAs should be enforcing minimum key sizes, and ensuring the keys are minimally
encoded and well-formed. CAs should not be required to check anything else.
This is not to say that CAs shouldn’t choose to enforce stricter requirements
on keys. Maybe some CAs do want to block certificates with Debian Weak Keys, or
block known compromised keys from device vendors with poor security practices.
But that should be a business decision made by the CA, not something that needs
to be codified by the baseline requirements, and enforced by root programs.
Unlike many forms of misissuance, and all forms of validation failure, the
security impact of a weak key is limited to the subscriber, not other sites.
The ultimate responsibility for weak keys should rely on the subscriber, not
the CA.

**Root programs and CAs should focus on adding requirements to the BRs that add
clear security value and are observable externally**, like they did with the
introduction of [Certificate Transparency][ct]. Similarly, they should be
**cutting requirements that add process with limited security value**. Weak key
"incidents" are process without security value.

The Web PKI has many upcoming challenges---migrating to post-quantum
cryptography efficiently, improving and expanding ACME and issuance automation,
and reducing certificate lifetimes. Focusing on Debian Weak Keys, an over
fifteen-year old bug, is a waste of time. We only have weak key checks because
it was a convient way to do a specific vulnerability mitigation over a decade
ago. Weak key checking does not need to be a permenant resonsibility of CAs.
**The Web PKI would be better off if we removed the requirement to check weak
key checks at issuance time from BRs, instead of codifying it even further.**

[^1]: Also to revoke outstanding certificates, if they are made aware after
  issuance.
[^2]: Fermat factorization is checked for by CAs up to N=100. But what about
  N=101?

[br-weak-keys]: https://github.com/cabforum/servercert/blob/a0360b61e73476959220dc328e3b68d0224fa0b3/docs/BR.md?plain=1#L1221
[roca]: https://github.com/crocs-muni/roca
[debian-weak-keys]: https://wiki.debian.org/SSLkeys
[ps-and-qs]: https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/heninger
[linux-csprng]: https://words.filippo.io/dispatches/linux-csprng/
[ct]: https://certificate-transparency.org
[sc59]: https://lists.cabforum.org/pipermail/servercert-wg/2023-May/003735.html
[hanno]: https://groups.google.com/a/mozilla.org/g/dev-security-policy/c/gIbj0kRfyko/m/__MeiUeWBQAJ
