---
title: "How to distrust a CA without any certificate errors"
date: 2025-03-06T15:14:08-05:00
---

A "distrust" is when a certification authority (CA) that issues [HTTPS
certificates][certs-explained] to websites is removed from a root store because
it is no longer trusted to issue certificates. This means certificates issued by
that CA will be treated as invalid, likely causing certificate error
interstitials in any browser that distrusted the CA. Distrusts can happen for
security reasons, compliance reasons, or simply due to a lack of trust in the
operators. In the past, the complexity and user impact of distrust events have
largely been dependent on the size and usage of a CA---the larger the CA, the
[longer and more complex the timeline was to distrust it if it
misbehaved][symantec-distrust], and the more likely users were to encounter
certificate errors. Nowadays, the situation is different.

Most user agents[^1] require certificates to be logged to public [certificate
transparency][ct] (CT) logs. Since the introduction of CT, most distrusts are no
longer due to key compromise and domain validation failures. Today, CAs are much
less attractive target to exploit than they were in the early 2010s because any
maliciously issued certificate still needs to be logged to CT[^2] to be trusted
in browsers. This requirement means that maliciously issued certificates via CA
key compromise are publicly auditable and visible. This drastically decreases
the value of using a compromised CA key as a vector for targeted MITM attacks,
compared to other [exploitation methods][cne].

Instead of key compromise, most distrusts today are over a pattern of repeated
failures by a CA to comply with the [Baseline Requirements][brs] (BRs). The BRs
are the standard set of rules that apply to all CAs. The BRs are maintained by
the [CA/Browser Forum][cabf] (CABF). Think of the CABF as the [IETF][ietf], but
for CAs, and the BRs as additional RFCs that define CA behavior, including how
to perform _domain control validation_ (DCV).

Beyond CT, certificates now have much shorter lifetimes than they did in the
2010s. This is good because [shorter certificate lifetimes are more
secure][zane-lifetimes]. The current maximum age of a certificate, set in 2020,
is 398 days (13 months), and there's a [ballot][sc81] in the CABF to gradually
lower it to 47 days, whereas lifetimes were unlimited prior to 2012, and still
up to five years until 2018. This means that any change in how certificates are
issued (e.g.  requiring CT), applies to all time-valid certificates within 13
months. "Legacy" certificates are at most one year old, and we can identify the
full set of time-valid certificates by trawling CT logs.

The most complicated distrusts of the 2010s had neither of these
properties---not all certificates were logged to CT, and there existed
time-valid certificates from at least 2-5 years ago at any given time. This
meant that any distrust at the time had to look backwards at existing
certificates, as well as forwards, at certificates that were not yet issued.  CT
provided an incomplete view of the active set of certificates, and the existence
of time-valid certificates with extremely long lifetimes meant that a CA that
stopped issuing could still have unexpired certificates for years.

Luckily, the Web PKI is in a much better space now than it was ten years
ago[^3]. Nowadays, distrusts can be primarily _forward looking_, meaning that
they don't need to affect current time-valid certificates, and can instead
distrusts can be applied to _any certificate issued by the distrusted CA after
some future date_. During this period, time-valid certificates issued before the
cutoff continue to work, even if their validity extends past the cut off. The
threshold only needs to be applied to the `NotBefore` (start) date, rather than
the `NotAfter` (expiration) date.

SCTNotAfter is a way of a getting cryptographic assurance about the
NotBefore date, and can be used to implement distrusts that "grandfather in"
existing certificates, without risking a CA backdating a certificate to get
around the distrust (which [has happened in the past][wosign-backdate]!). The
way it works is by selecting an "SCTNotAfter date" for some CA certificate, and
then requiring any leaf certificate that chains through that CA to have at least
one SCT with a timestamp from _before_ the SCTNotAfter date. This means that the
certificate was disclosed to at least one CT log prior to the SCTNotAfter date.
Even if the CA backdates the NotBefore field, the timestamp in the SCT
should[^4] still be accurate.

For a CA that's distrusted over repeated compliance failures, this date can be
in the future. This gives time for the CA to reissue any existing certificates
for their max lifetimes, allowing each customer of the CA a full certificate
lifecycle to transition to a new CA. Not all customers will be paying attention
to whether or not their CA was distrusted, however, presumably the distrusted CA
will stop issuing certificates after the SCTNotAfter date, since they wouldn't
work in browsers. When renewal time comes around, customers will be unable to
get a new certificate from the distrusted CA, and can migrate to a new CA
instead. With SCTNotAfter, customers have an entire certificate lifecycle after
the cutoff date to plan for a transition to new CA. Once every certificate
issued before the SCTNotAfter date expires, the distrusted CA can be safely
removed from the root store.

In the event of a security incident or key compromise, the SCTNotAfter date can
be set in the past. Let's say we learn at time T that [Honest Achmed's
CA][honest-achmed] was compromised at time P, where P is before T. Setting an
SCTNotAfter date of P - 1 allows every existing certificate from before the
compromise to live out its remaining lifecycle, while limiting the distrust to
only certificates from after the compromise. This allows as many certificates as
possible to continue to work, while blocking any potentially malcious
certificate.

The Chrome distrusts of [GLOBALTRUST][ecommerce-distrust] and
[Entrust][entrust-distrust] were both implemented using SCTNotAfter. Unlike the
Symantec distrust, neither distrust has resulted in unexpected user-facing
certificate interstitials. This is an improvement for user security, and user
experience.

While distrusts are sometimes necessary, the best outcome for user security
remains a robust Web PKI where each CA and browser is commited to continuous
improvement and user security. When all participants are commited to user
security, distrusts are few and far between.

[ct]: https://transparency.dev
[cabf]: https://cabforum.org/
[ietf]: https://www.ietf.org/
[symantec-distrust]: https://security.googleblog.com/2017/09/chromes-plan-to-distrust-symantec.html
[cne]: https://securitycryptographywhatever.com/2024/06/24/mdowd/
[sc81]: https://github.com/cabforum/servercert/pull/553/files
[wosign-backdate]: https://wiki.mozilla.org/CA/WoSign_Issues#Issue_S:_Backdated_SHA-1_Certs_(January_2016)
[ecommerce-distrust]: https://groups.google.com/a/ccadb.org/g/public/c/wRs-zec8w7k/m/MeZgTE4PAgAJ
[entrust-distrust]: https://security.googleblog.com/2024/06/sustaining-digital-certificate-security.html
[certs-explained]: https://dadrian.io/blog/posts/certificates-explained/
[brs]: https://cabforum.org/working-groups/server/baseline-requirements/
[honest-achmed]: https://bugzilla.mozilla.org/show_bug.cgi?id=647959
[zane-lifetimes]: https://zanema.com/papers/imc23_stale_certs.pdf

[^1]: Firefox, Chrome, Edge, Brave and Safari all require certificates to be
  logged (non-exhaustive list).
[^2]: inb4 SCTs are a promise, not an inclusion proof. Look, CT logs are hard
  enough to run correctly, let alone maliciously. And browsers can audit SCTs
  for inclusion.
[^3]: Living, laughing, loving. Thriving, one might say.
[^4]: Again, the CT log could also be lying! But this auditable and there's no
   evidence of it ever happening. If there were, it could be mitigated by
   switching the requirement from _any_ SCT to _all_ SCTs, which would require
   multiple CT logs to collude about the timestamp.
