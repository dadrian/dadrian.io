---
title: "Certificates, Explained"
date: 2023-06-14T18:53:00-06:00
---

This post is about HTTPS (X.509) certificates used on the web[^14]. It has two
parts:

1. [Certificates explained without cryptography](#p1)
2. [Certificates explained with cryptography](#p2)

The explanation with cryptography depends on the explanation without
cryptography, so you'll want to either read both, or only read Part 1.

## Certificates and certification authorities, explained without cryptography {#p1}

Websites use certificates to prove that they're the "real" website[^13], and not
an imposter. The certificate is used to bootstrap a secure connection between
the browser and website that cannot be read, modified, [MITM]'d, or intercepted
by an attacker, who could then read and exfiltrate data sent between the user
and the website, such as passwords, messages, and financial or health
information. A **certification authority (CA)** issues certificates to websites.

CAs act as a trusted third-party that validate the authenticity of operators of
domains. After validating the operator, a CA issues a **certificate** that
attests to their identity. CAs are responsible for validating that a site is
operated by the entity requesting the certificate before issuing a certificate.
Some browsers, such as Chrome and Safari, additionally require that CAs append
all certificates they issue to a publicly-accessible [Certificate Transparency]
log, so that they can be inspected for correctness. Certificates are encoded in
a format called X.509.

Every certificate has a **Subject** and an **Issuer**. When a web browser connects to a
website using HTTPS:

1.  The browser verifies that the domain name is included in the subject[^1] of the
    certificate.
2.  The browser builds a **chain**[^2] of certificates from the website certificate
    (the **leaf**) by recursively finding a **parent** certificate whose
    *Subject* matches the *Issuer* of the **child** certificate. The chain
    starts with the leaf certificate and ends at a **root certificate** managed
    by a trusted certification authority.
3.  At each step in the chain, the browser verifies the authenticity of the issuer,
    the browser verifies that the parent issued the child certificate, which ensures
    the certificate is not an unauthorized "fake" certificate used by an
    attacker to intercept the connection.

Once the browser finishes this verification process, it can open a secure HTTPS
connection between itself and the website[^5]. If the verification process
fails, the browser will display a certificate error interstitial. You can see
examples of these errors in Chrome by navigating to `chrome://interstitials`.

### Root certificates and root stores

A **root certificate** is a certificate that represents a *certification
authority* that the browser trusts to vouch for the identity of websites. Root
certificates are **self-signed**, meaning the *Subject* and *Issuer* are the
same. The decision of which roots, and therefore which CAs to trust, is made by
the operator of a **root store**, which is a collection of root certificates
that are trusted by default. A **root program** (/ˈproˌɡrəːm/) is the set of
rules of policies that govern membership in a specific root store. Some common
root stores are:

-   NSS (Mozilla), used by Firefox and many Linux distributions and Python
    packages
-   Microsoft Root Store, used by Windows and Microsoft Edge
-   Apple Root Store, used by Safari, MacOS, and iOS
-   [Chrome Root Store](https://g.co/chrome/root-policy), used by Chrome

Root stores are required to anchor trust to a third-party. Root certificates are
**trust anchors**, meaning that anything that chains its trust to a root
certificate is considered valid by anyone that trusts that root. Without a root
store, a web browser would not know if a **certificate chain** was trusted,
because it would not be able to discern between a chain that ends at a trusted
certification authority and a chain that ends at a random self-signed
certificate.

When a root certificate is included in a major root store, this means it is
trusted by default on that platform. In practice, this means websites must use
HTTPS certificates that chain to a root certificate included in all major web
browser and operating system root stores.

To bootstrap trust, root stores are shipped as part of the platform they're
associated with. For example, the Chrome Root Store is included in the Chrome
download package.

### Root Programs and Policies

A **root program** is the set of rules and policies that govern which root
certificates are included in a root store. While any individual application is
capable of defining its own root store, in most cases the root store is provided
transparently by the platform (operating system).

The operating system and web browser root stores have collaborated with
certification authorities via the CA/Browser Forum (CABF) to create a set of
rules known as the **baseline requirements** that define the technical and
behavioral requirements for certificate authorities when validating website
operators and issuing certificates. This includes defining additional rules on
top of X.509 on how to structure certificates, and standardizing which
cryptographic algorithms can be used with certificates. Root certificates can
act as a root of trust for any website on the Internet[^3], which means an
insecure certification authority can threaten the security of every website on
the Internet. To mitigate this risk, root programs aim to enforce a strict set
of rules and security practices[^4] that certification authorities must follow
in order to include a root certificate in their corresponding root store. Root
programs may also define additional rules on top of the baseline requirements,
specific to the needs of their root store.

This system of certificates, certification authorities, root stores, and root
programs working together to secure connections between web browsers and web
sites is known as the **web public key infrastructure**, or **Web PKI**.

If a certification authority violates the requirements of a root program, the
root program may choose to **distrust** the root certificates from that
certification authority by removing them from the root store or rejecting chains
that end at their root certificates[^7]. Any site that uses a certificate issued
by the distrusted certification authority would result in an error until the
site obtains a new certificate issued by a certification authority whose root
certificate is still trusted by the root program and included in the
corresponding root store. Root programs need to balance the security of the Web
PKI with the risk of breaking users' access to websites when choosing to
distrust a certification authority.

### Local Roots and Private PKIs

The Web PKI is an example of a **public PKI** because it governs, secures, and
enables certificate issuance for any website that is publicly accessible on the
Internet.

Sometimes users, especially enterprises, need to authenticate web sites that are
not public-facing, such as corporate intranet sites that are only accessible to
corporate users or private sites hosted on a private network. In these
situations, users may choose to create their own root certificate, and use it to
issue certificates for their private sites so that they can still be accessed
using HTTPS in a web browser. This is known as a **private PKI**. By definition,
private PKIs are not subject to the same requirements as the public web PKI,
because private PKIs are not meant to be shipped as part of a public root store.

Private root certificates are not trusted by default by platforms and web
browsers. Instead, users or administrators must specifically configure their
machines to trust a private root certificate. This may be a requirement for
secure access to private intranet resources at an organization.

To handle this use case, platforms can be thought of as having two root stores:
the **system root store** (or browser root store), managed by a root
program[^6], and the **locally-managed root store**[^9], managed by the user or
their administrator. A certificate chain will successfully verify if the root
certificate is included in the system root store or the local root store.

Beyond anchoring trust, root stores can also anchor *distrust*, by defining a
set of explicitly distrusted roots[^11]. In the case of the system root store,
this is often equivalent to excluding a root from the root store[^10]. However,
in situations where one or more root stores are consulted (e.g. a local root
store and a system root store), expliciting listing distrusts can be used as a
mechanism to resolve conflicts between the root stores, or for one root store to
override the trust decision of another root store. For example, a local root
store may choose to explicitly list a certificate from the system root store as
distrusted. Verifiers need to choose a conflict resolution method that meets the
requirements for their users. Resolving a trust decision is dependent on if, for
a given root store, a certificate has an **explicit** trust result, meaning it
chains to a trusted root or distrusted certificate, or it has an **unknown**
trust, meaning that no chain could be built to a trusted or distrusted root.
This may be because no chain could be built at all, or because the chain ended a
certificate that was not part of a the root store at all. In practice, there are
three possible resolution methods:

1.  **Strictest root store wins.** An *explicit* distrust result will override
    an *explicit* trust result, and an explicit trust or distrust will override
    an *unknown* trust, regardless of which root store the trust result comes
    from. This ensures any certificate distrusted by any root store will always
    be rejected, and is the most "secure" option.
2.  **Local root store wins.** An *explicit* system root store trust result only
    overrides *unknown* trust result by the local root store. An *explicit*
    trust or distrust by the local root store overrides *any* result from the
    system root store. This resolution method allows the user to override any
    decision made by a root program.
3.  **System root store wins.** The local root store is only consulted for
    *unknown* trust results by the system root store. This effectively means
    that a local root store is only capable of adding new trust anchors, and is
    not capable of constraining trust stricter than that of the system root
    store. This is generally considered user-hostile.

Chrome implements a strictest-wins conflict resolution policy[^12].

Locally-managed root stores allow administrators and advanced users to make
their own trust decisions for their own networks and devices, while still
allowing root programs to enable and enforce a baseline of security for the
public Internet.

### Non-web PKI

X.509 certificates issued by certification authorities are used for other
purposes, including authenticating emails ([S/MIME]), authenticating connections
between email servers ([STARTTLS]), authenticating software packages (code
signing), and authenticating Internet routers ([RPKI]). These systems may
overlap in technologies and participating organizations, however the rules,
requirements, and goals will vary. Web browsers and their associated root
programs define the rules solely for authenticating public websites.

In practice, there exist root certificates that are used for multiple purposes.
The Chrome Root Program is [working towards][moving-forward-together] limiting
root certificates that are part of the web PKI to be used solely for the web
PKI. Furthermore, platforms may choose to present their system root store as the
union of root certificates for all purposes and rely on X.509 facilities or
platform configuration to limit which certificates are valid for which purpose.

Operating systems may need to account for more use cases than authenticating web
sites, and therefore may need to include root certificates intended to be used
for non-web purposes. These root certificates should be stored separately or
configured with an intended usage.

## Client Certificates

Everything described above has implicitly been assuming _server certificates_,
i.e. that the certificates are used to identify servers, usually via their site
name. _Client certificates_ are certificates that are used to identify a client.

Client certificates operate the same as server certificates. There is still a
root certificate and a chain of trust that can be used to verify a client
certificate. However, instead of a site name embedded in the certificate, the
certificate will instead have some identifier for a client, usually either an
email address, employee ID number, or a device name. In a client certificate
scenario, the root certificate that anchors trust in the client certificates
will be distributed to servers, and certificates will be issued for keys held by
clients. This is the reverse of the server certificate use case, where root
certificates are distributed to clients and used to authenticate the
certificates that identify the keys held by servers.

Client certificates are not part of the Web PKI. Instead, they are often part of
a private PKI. The root of trust for a client certificate PKI is often the
directory of employees at a company. Some process attached to corporate
single-sign on or corporate device issuance may additionally issue a client
certificate that can be used by other corporate services to identify clients or
devices. The best practice for client certificates is to use a completely
different PKI hierarchy (root certificate with distinct non-overlapping chains)
from other PKI use cases.

Client certificates are often used by government PKIs to identify government
employees or citizens of some country. This is often implemented using Smart
Cards (PIV).

## Certificates, once more, with cryptography {#p2}

A certificate for the web PKI is a signed statement that binds a set of names to
a public key. Certificates used on the web are encoded using the X.509 format,
which contains a subject and public key, an optional list of domain names, an
issuer, and a signature by the issuer over the rest of the certificate.
Certification authorities are responsible for verifying that the operator of a
domain controls the private key corresponding to the public key in the
certificate issued to that domain.

Self-signed certificate are certificates where the issuer and the subject are
the same. A certificate chain is a list of certificates, beginning with a leaf
and ending at a root certificate. The leaf certificate will contain a set of
domain names, a public key, and an issuer and associated signature. At each step
in the chain, the subject of the parent certificate will match the issuer of the
child certificate. For the link to be valid, the child certificate must contain
a valid signature from the key contained in the parent certificate. The
signature requirement ensures that the browser can tell the difference between
the "real" issuer and a "fake" issuer with a matching name[^3].

A trusted certificate chain ends at a root certificate, which is a self-signed
certificate[^8] that is included in the root store, and acts as a trust anchor.
There may be other chains for a certificate that do not end at a trusted root
certificate, and there may be certificates that do not chain to any trusted
roots. The certification authority associated with the root certificate is
responsible for controlling and securing access to the private key corresponding
to the public key in the root certificate.

[MITM]: https://en.wikipedia.org/wiki/Man-in-the-middle_attack
[Certificate Transparency]: https://certificate.transparency.dev/
[CAA]: https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization
[key pinning]: https://www.imperialviolet.org/2011/05/04/pinning.html
[The Dirty Laundry of the Web PKI]: https://docs.google.com/presentation/d/1oGZjzoVXFxfzgfSOXg3q2rzJvZ4R0k-_RVU1cpKL7LA/edit?resourcekey=0-3lLsZOTey5msLd9r1h0KUw#slide=id.g1ce7cb914c5_0_10
[S/MIME]: https://en.wikipedia.org/wiki/S/MIME
[STARTTLS]: https://jhalderm.com/pub/papers/mail-imc15.pdf
[code signing]: https://en.wikipedia.org/wiki/Code_signing
[RPKI]: https://help.apnic.net/s/article/Resource-Public-Key-Infrastructure-RPKI
[moving-forward-together]: https://www.chromium.org/Home/chromium-security/root-ca-policy/moving-forward-together/
[^1]: Technically, the *Subject Alternative Name*, not the subject itself.
[^2]: For robustness, this should actually be implemented equivalent to a
    directed graph where nodes are a Name and Public Key tuple, and edges are
    certificates where the issuer is one node and the subject is the other
    node.
[^3]: There are technical means for domain owners to limit which certification
    authorities can issue certificates for their domain (e.g. [CAA],
    [key pinning]), however these rely on PKI expertise on the part of the
    domain owner, and have varying degrees of efficacy, risk, and scalability.
[^4]: In practice, it's difficult for root programs to enforce non-public-facing
    requirements. For more information, see *[The Dirty Laundry of the Web
    PKI]*, a talk by Emily Stark from Usenix Enigma 2023.
[^5]: This is not a full description of all of the checks enforced during a
    secure certificate verification process. See go/chrome-cert-verifier for
    more details. Do not use this description as the basis for a verifier.
[^6]: Platforms may also allow the user to modify the system root store in
    various ways. Implementation details vary, but it's often easier to think
    of any trust modification as a change to the local root store, and to
    think of the system root store as fixed by the platform. In practice, the
    user experience for distrusting a system root may look like modifying the
    system root store, but when discussing the product behavior, this is
    considered a local root store trust modification.
[^7]: Root programs often reserve the right to distrust any root certificate at
    any time.
[^8]: Depending on your verifier, root certificates might not need to be
    self-signed. Since they act as a root of trust, there's not really a point
    in verifying the signature---you've already decided to trust it. This
    means you could anchor your trust on any certificate, whether it's
    self-signed, signed by someone else, or not signed at all.
[^9]: Locally-managed root stores are sometimes referred to as user root stores.
[^10]: This depends on implementation behavior slightly. For example, a browser
    may choose to treat certificates that are blocked by the system root
    store distrust list as a non-overridable error, whereas certificates that
    chain to an unknown root may be a user-overridable error.
[^11]: Optimally, you actually want to distrust a *Subject Public Key Info*
    (SPKI), rather than a certificate. This is allows for any certificate
    that uses the distrusted key to automatically be distrusted, rather than
    having to list them all explicitly and a priori. In practice, root
    programs will implement SPKI-based distrusts, but the mechanism exposed
    to end users is often to distrust individual certificates directly, even
    though the resulting distrust is not as complete. In a certificate-based
    distrust, you can't distrust a certificate that uses the SPKI that you
    don't already know about.
[^12]: When importing trust settings from platforms, Chrome is sometimes limited
    in its ability to implement a strictest-wins policy.
[^13]: In this case, a real website is defined as the content the domain owner
    intends to serve at that domain. However, the domain itself may still be
    part of a phishing attempt. A phishing page that pretends to be
    `google.com` but uses a different domain name such as `fake-google.com` can
    still get a certificate that verifies in a browser for the
    `fake-google.com` name. Certificates in the Web PKI are used to bind a
    cryptographic key pair to a domain name. They are not used to authenticate
    the identities of businesses or individuals who operate the domain.
[^14]: This post assumes the client is a web browser, and that only the server
    is providing a certificate. Similar rules apply for when the client is a
    TLS library in code, or if the client is an operating system verifying the
    signature on a package, with slight variations. If the client is also
    providing a certficate, like in mTLS, the process is largely the same, but
    the server will also act as a verifier, and the name being verified might
    not be a hostname.

