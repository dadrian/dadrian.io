---
title: "Proxies all the way down."
date: 2026-04-26T19:14:46-04:00
---

A couple days ago, [exe.dev][exe] raised a lot of money[^1]. I decided to poke
around with it a little, and signed up. After 24 hours, I realized their trial
was only 7 days long, so I figured I should actually log in instead of just poke
around on their website. In doing so, I noticed a few interesting things that I
thought were worth a quick writeup:

1. I didn't have to configure an SSH key to be able to `ssh exe.dev`.
2. I could SSH to my VM despite not having a unique IP and no support for [SNI][sni] in SSH.
3. The [Github Integration], which allowed me to clone private repositories, didn't require any host-side configuration.

The second item, SSH with non-unique IPs, is [already covered by exe.dev
themselves][exe-ssh], so I won't go through it here. The other two, I want to
run through quickly.

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

##

[^1]: They've raised ~$35MM total, which is simultaneously a lot of money, but
  also tiny when compared to, you know, a cloud.
[^2]: They are rate limited, and authenticated accounts have a higher rate
  limit, but no authorization is required from the account owning the email
  being searched.
[^3]: Always good to assume that public keys are public!

[exe]: https://exe.dev
[github-davidcadrian-email]: https://api.github.com/search/users?q=davidcadrian@gmail.com
[github-dadrian-keys]: https://github.com/dadrian.keys
