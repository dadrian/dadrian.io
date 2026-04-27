---
title: "Proxies all the way down."
date: 2026-04-26T20:21:00-04:00
---

A couple days ago, [exe.dev][exe] raised a lot of money[^1]. I decided to poke
around with it a little, and signed up. After 24 hours, I realized their trial
was only 7 days long, so I figured I should actually log in instead of just poke
around on their website. In doing so, I noticed a few interesting things that I
thought were worth a quick writeup:

1. I didn't have to configure an SSH key to be able to `ssh exe.dev`.
2. I could SSH to my VM despite not having a unique IP and no support for
   [SNI][sni] in SSH.
3. The [Github Integration][exe-github-docs], which allowed me to clone private
   repositories, didn't require any host-side configuration.

The second item, SSH with non-unique IPs, despite SSH having no host header or
SNI equivalent, is [already covered by exe.dev themselves][exe-ssh], so I won't
go through it here[^4]. The other two, I want to run through quickly.

I didn't read any code for this, nor do I have any inside knowledge about how
EXE works. I'm purely inferring based on my understanding of the interfaces
involved.

## Yo, where the public keys at?

I was surprised that I could SSH into EXE despite never telling EXE what my
public key was. Conveniently, they explain it to you in the control plane shell
you get when you log in---when I created my account with Google OIDC, they took
my email and [looked up the Github account][github-davidcadrian-email] for it,
and then used that to [look up my public keys][https://github.com/dadrian.keys].
You can do it to, the links in the previous sentence are literally to the
endpoints that give you this information for my email. These endpoints are
accessible without authentication[^2]. This isn't that interesting, but it is
clever. This does mean that if you use `IdentitiesOnly yes` in your SSH config
for `Host *`, or have a custom `IdentityFile` you use for `Host github.com`,
you'll still have to explicitly configure _offering_ the same key that you use
with Github. But that's already on you for wanting to configure
IdentityFile[^3].

## Github Integration

EXE also has a [Github Integration][exe-github-docs], which, once enabled in the
dashboard via an OAuth flow, allows you to clone private repositories from your
EXE VMs, without configuring anything other than the initial git clone. I
initially assumed this put some credentials somewhere on the VM via whatever
base image they were using, however it turns out this is not the case.

The key trick that EXE plays to make this work, is that they replace the
hostname for Github with a proxy that is local to your VM. So instead of running
`git clone git@github.com:...`, you run `git clone
my-integration-name.int.exe.dev`. You might say this is cheating---didn't I just
say there was no configuration? Yes, but it's the _same_ configuration you'd be
doing for Github as well---if you're going to clone a repository, you have to
provide the URL of the host you're cloning from at some point. Credit to EXE for
using the one pre-existing and necessary joint and figuring out how to build off
of it.

Having not seen any of their code, let's dive into how I assume this works.

- The hostname `int.exe.eyz` doesn't exist and doesn't even have an NS. However,
  we can assume that `int` is short for integration, and all subdomains of it
  point to RFC 1918 space that has some sort of meaning when accessed from an
  EXE VM, because...
- The hostname `my-integration.int.exe.exy` points to 169.254.169.254, which is
  in the self-assigned IP range and either unreachable or necessarily
  link-local[^5]. This address is commonly used in cloud providers as a metadata
  endpoint. This name is actually publicly resolvable---you don't need to be on
  an EXE VM to resolve it. This is the added side benefit of meaning that you
  can use an [ACME DNS challenge][acme-dns] to get a certificate for the domain,
  or better yet, a [wildcard certificate][int-cert] for `*.int.exe.xyz`.
- In this case, it's a git+https non-transparent proxy for Github repos. Well,
  once git opens the connection via HTTPS to the proxy host, EXE can make the
  equivalent requests your client would make to Github, but inject one of those
  pesky access tokens. This way, the access token never needs to touch your VM,
  meaning you've successfully outsourced your secrets management problem to
  EXE[^6].
- Where does EXE get the tokens from? Well, their [Github
  Application][github-app-exe] necessarily has a JWT associated with it, that
  they can use to get an "installation access token" that grants them access on
  behalf of your Github account (which you authorized while signed into their
  dashboard via OAuth). EXE uses this token to access whatever repositories you
  configured in the integration, on your behalf. This token can be short lived
  (it only needs to be around for the Git operations, not while the Git
  repository is being accessed locally), and can be refreshed dynamically by the
  proxy using the app JWT.

Now, your secrets management problem has been reduced to EXE maintaining custody
of a single key backing a JWT. Neat!

You might have noticed I skipped one major thing---how does the proxy know which
users are accessing it? It's hard to know this externally[^7], but we can make a
couple assumptions given the interface:

- You can make a direct TLS connection to the host
- The standard git tools have no credentials to add
- Therefore, EXE must be identifying the connection via some other mechanism,
  before injecting credentials to proxy.

The VM has VM in the 10.0.0.0/8 address space locally, with the default route in
the same IP space. Presumably, this is taking place inside some sort of VPN or
SDN wrapper layer, likely Wireguard, which is presenting an authenticated IP
address that can be mapped back to a customer VM directly to the proxy. That
way, the proxy can determine which requests come from which customers, and then
access the correct Github Installation ID for a given customer VM.

## Why did you write this?

Look, I just thought [it was cool][https://xkcd.com/356/].

[^1]: They've raised ~$35MM total, which is simultaneously a lot of money, but
  also tiny when compared to, you know, a cloud.
[^2]: They are rate limited, and authenticated accounts have a higher rate
  limit, but no authorization is required from the account owning the email
  being searched.
[^3]: Always good to assume that public keys are public!
[^4]: Through a completely unrelated set of events, I did collaborate on a
  protocol called ["Hop"][hop] that tweaks the SSH transport protocol to add
  this and some other things, [appearing at Usenix Security 2026][hop-usenix].
  Credit to [Paul Flammarion][paulf].
[^5]: Link local relative to whatever potentially virtualized L2 the VM exists
  on. It's presumably SDNs all the way down. Blame Martin.
[^6]: Short-lived credentials and ACLs rule everything around me.
[^7]: I didn't check, but in theory, they might have forgotten this step and you
  could clone anyone else's repository so long as you knew its name and the name
  of the integration. If that's the case, then I am retroactively claiming this
  post is actually ironic.

[exe]: https://exe.dev
[github-davidcadrian-email]: https://api.github.com/search/users?q=davidcadrian@gmail.com
[github-dadrian-keys]: https://github.com/dadrian.keys
[exe-github-docs]: https://exe.dev/docs/integrations-github
[exe-ssh]: https://blog.exe.dev/ssh-host-header
[hop]: https://hop.computer
[hop-usenix]: https://www.usenix.org/conference/usenixsecurity26/presentation/flammarion
[paulf]: https://paul.flammarion.eu/
[int-cert]: https://platform.censys.io/certificates/7369aadb99f7b108747428e5f36698e864c6cce80032e02c20bf2742d623d094
