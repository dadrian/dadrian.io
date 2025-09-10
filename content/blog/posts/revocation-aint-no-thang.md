---
title: "Revocation ain't no thang."
date: 2025-09-02T18:13:00-04:00
---

It is well-known that revocation for HTTPS doesn't work. Adam Langley [wrote
about it][agl-revocation] over 10 years ago. Since then, the Web PKI has
drastically changed for the better, despite not "solving" revocation.
Unfortunately, many people interpret Adam's post to mean "we must build a better
revocation system for the Web PKI, today", when in fact, the reality is that
_revocation does not make sense to solve_, and people should stop trying to
solve it directly, because **the actual solution to revocation in the public Web
PKI is short-lived certificates**.

The short version of why revocation doesn't work in practice is that
[OCSP][ocsp] is too slow and unreliable to be blocking, and too much of a
privacy leak to be used consistently without proxying[^1]. [CRLs][crl] are too
big to downloaded consistently (or at all!) by clients.

The web has specific connectivity constraints between clients, servers, and
certification authorities (CAs). On the web, browser clients are the relying
party (RP), cannot be assumed to have connectivity with the CA. For one, at the
scale of the web, CAs cannot handle the load if they were to be in-path for
every (or even a small percentage!) of network connections. The failure and
[subsequent deprecation of OCSP][ocsp-gone] is proof this connectivity doesn't
exist. We can also only assume the clients have connectivity to the server
they're _currently_ talking to. Clients may have some out-of-band communication
mechanism that allows them to periodically fetch data from their vendor[^3], but
they cannot _guarantee connectivity_ at any given time[^4].

Servers are the authenticating party (AP). Servers are expected to have an
out-of-band relationship with a CA, but similarly to clients, they are not
expected to have a reliable connection to the CA. They are expected to be able
to communicate with _at least one CA_ and acquire a replacement certificate once
every certificate lifetime[^2]. This is fairly weak requirement, even if
certificate lifetimes were to be only 24 hours. Servers prioritize availability;
CAs cannot be blocking for availability outside of certificate issuance.

The failure of both OCSP and CRLs from the client perspective are clearly
downstream from these connectivity constraints. They also explain the failure of
_OCSP stapling_ and _Must-Staple_. OCSP stapling is the act of having the server
periodically fetch OCSP responses, cache them, and serve them to clients.
However, if you cannot assume the presence of a reliable connection to any
_single_ CA outside of a timeframe suitable for issuance, then a server cannot
have a reliable connection to any _specific_ OCSP server outside the same time
frame. This is actually a stronger constraint than the connectivity required for
issuance, as a server can always round-robin their certificate acquisition or change CA
operators to acquire a new certificate, whereas the OCSP response must come from
the same CA that issued the original certificate. This is equivalent to making
the CA blocking for availability[^5].

[^1]: Which is its own bag of worms, especially since OCSP is not over HTTPS.
[^2]: With things like [ARI][ari], servers should communicate with their CA much more often. But it's all optimistic and nothing bad happens to server availability if something gets dropped now and then.
[^3]: For example, with Chrome this would be the update servers and [component updater][component-updater]
[^4]: See [this post][davidben-connectivity]
[^5]: inb4 "what if the server just got a new Must-Staple certificate from a different CA"? Well, at some point we're just getting certificates at the same lifetime as an OCSP staple cache, which happens to be the basis for the definition of a short-lived certificate.

[agl-revocation]: https://www.imperialviolet.org/2011/03/18/revocation.html
[component-updater]: https://chromium.googlesource.com/chromium/src/+/lkgr/components/component_updater/README.md
[davidben-connectivity]: https://mailarchive.ietf.org/arch/msg/plants/-icDMfo0S4DegWU29PvcPR91pTA/
[ocsp-gone]: \TODO
[crl]: \TODO
[ocsp]: \TODO

