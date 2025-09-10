---
title: "Revocation ain't no thang."
date: 2025-09-10T04:00:00-04:00
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
out-of-band relationship with a CA, but similar to clients, they are not
expected to have a _reliable_ connection to the CA. They are expected to be able
to communicate with _at least one CA_ and acquire a replacement certificate once
every certificate lifetime[^2]. This is a fairly weak requirement, even if
certificate lifetimes were to be only 24 hours. Servers prioritize availability;
CAs cannot be blocking for availability outside of certificate issuance.

The failure of both OCSP and CRLs from the client perspective are clearly
downstream from these connectivity constraints. They also explain the failure of
OCSP Must-Staple. OCSP stapling is the act of having the server periodically
fetch OCSP responses, cache them, and serve them to clients. OCSP Must-Staple is
a certificate flag that requires a valid OCSP response to be stapled alongside
the certificate for the certificate to be considered valid.  However, if you
cannot assume the presence of a reliable connection to any _single_ CA outside
of a timeframe suitable for issuance, then you similarly cannot assume the
server will have a reliable connection to that _specific_ CA's OCSP server
within the same timeframe. This is actually a stronger constraint than the
connectivity required for issuance, as a server can always round-robin their
certificate acquisition or change CA operators to acquire a new certificate,
whereas the OCSP response must come from the same CA that issued the original
certificate. This is equivalent to making the CA blocking for availability[^5].

In the connectivity model of the web, this means that information about the
validity of a certificate must come from the server at the time of the
connection, or periodically in the background from the browser vendor.
Since server operators only have guaranteed connectivity to the CA at the time
of issuance, this means servers can only provide information about validity at
the time the certificate was issued, in the form of the `NotBefore` and
`NotAfter` timestamps defining the certificate validity window. Since browser
vendors have no guaranteed connectivity, this means you can at best ship a fixed
set of data to all clients on an hourly to daily rate, depending on data size.

So where does this leave us for revocation? There are two options:
1. **Condense all revocation information down into something a browser vendor
  can ship daily.** CRLs are now required for all CAs. This is beneficial, as it
  functions as public documentation of all revocations. CRLs are both useful for
  analysis, and provide a basis for browser vendors to preprocess revocations
  and ship condensed information to their clients. Firefox does this via
  [CRLite][crlite]. Safari has [Valid][safari-valid]. Chrome does this by only
  shipping differential updates of revocations with the "key compromise" reason
  code[^6]. None of these systems scale particularly well, meaning if there are
  too many concurrent revocations, no browser is capable of shipping all of them
  to all of their clients on a timely basis.
2. **Short-lived certificates.** If certificate lifetimes are on par with former
  OCSP response validity windows (10 days), or better yet, browser revocation
  information update periods (24-48 hours), then any revocation information that
  can be provided within the web connectivity model is equivalent to knowing
  whether or not a certificate is unexpired.

This is certainly not an ideal world, as it still leaves a roughly day-long
maximum compromise window for any certificate. However, short-lived certificates
are the best possible end state under the current connectivity model. Not only
are they the theoretical best, but we're also likely to achieve it. The ecosystem
has been slowly marching towards short-lived certificates over the last decade:

- Certificate lifetimes were reduced to 39 months in 2015, 825 days in 2018, and
  then 398 days in 2020. More recently, certificate lifetimes are scheduled to
  [reduce to 47 days by 2029][sc81].
- The requirement to host an OCSP server has been removed, and CRLs are now
  required, which enables the browser-mediated revocation information stopgap.
- All major browsing engines now support certificate transparency, which reduces
  the efficacy of maliciously issued certificates.
- Increased adoption of ACME and other certificate lifecycle automation.
- Multiple CAs will issue certificates with lifetimes of one week or lower.

Every time certificate lifetimes are reduced, the Internet gets safer.
Fundamentally, certificate lifetime reductions reduce the risk window inherent
to a certificate---the reality on the ground can change between when a
certificate is issued, and when it expires. Shortening the validity window and
enforcing a revalidation is the best way to reduce that risk.

The only way to get better revocation than a short-lived certificate would be to
drastically rethink the connectivity model of the Web PKI.

## Drastically Rethinking the Connectivity Model of the Web PKI

The best way to ensure a connection is not revoked is to issue a credential that
is only valid for a single connection. This can be implemented by having the
authorizing party get a new credential for each connection, by having some sort
of three-way dance between a third-party with knowledge of keys and revocations
who mediates between the relying party and authorizing party. The three-way
dance could be a client querying a revocation server, or it could be a
credential from the authorizing party that is functionally countersigned by a
party trusted to enforce revocation.

You can see why this isn't a great fit for the web---you need a trusted party at
scale. You could imagine a system where sites prove domain ownership to CAs,
then browser vendors would reverify the domain validation from the CA, and
countersign a unique credential for each of their users. You can also
immediately see the hordes of Slashdot users, led by Cory Doctorow, coming to my
house with pitchforks, torches, and a copy of "Enshittification", simply for
suggesting that a browser vendor, such as Chrome, be the entity responsible for
authenticating HTTPS connections.

By which I mean, the connectivity model is kind of fundamental to the web...

# Takeaways

- Short-lived certificates are the answer for the public Web PKI
- Other PKIs may have other needs and potential solutions. Not all PKIs are the Web PKI.
- We do not need another marginally better CRL compression scheme.
- We need to keep reducing certificate lifetimes.

[^1]: Which is its own bag of worms, especially since OCSP is not over HTTPS.
[^2]: With things like [ARI][ari], servers should communicate with their CA much
  more often. But it's all optimistic and nothing bad happens to server
  availability if something gets dropped now and then.
[^3]: For example, with Chrome this would be the update servers and [component
  updater][component-updater]
[^4]: See [this post][davidben-connectivity]
[^5]: inb4 "what if the server just got a new Must-Staple certificate from a
  different CA"? Well, at some point we're just getting certificates at the same
  lifetime as an OCSP staple cache, which happens to be the basis for the
  definition of a short-lived certificate.
[^6]: Firefox is always quick to point out that not all security-relevant
  revocations have the `keyCompromise` reason code, to which I say, you wrote the
  reason codes, maybe you should fix `superseded` to discern domain validation failures.

[agl-revocation]: https://www.imperialviolet.org/2011/03/18/revocation.html
[component-updater]: https://chromium.googlesource.com/chromium/src/+/lkgr/components/component_updater/README.md
[davidben-connectivity]: https://mailarchive.ietf.org/arch/msg/plants/-icDMfo0S4DegWU29PvcPR91pTA/
[ocsp-gone]: https://cabforum.org/2023/07/14/ballot-sc063v4-make-ocsp-optional-require-crls-and-incentivize-automation/
[crl]: https://en.wikipedia.org/wiki/Certificate_revocation_list
[ocsp]: https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol
[sc81]: https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/
