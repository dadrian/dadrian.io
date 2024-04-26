---
title: "Corporate support does not stop the XZ backdoor"
date: 2024-04-13T20:10:00-05:00
---

Two weeks ago, the open-source community discovered a backdoor in XZ Utils, an
suite of tools that use the xz compression algorithm. The xz backdoor was
embedded inside liblzma, and took effect when liblzma was used in OpenSSH, a
common remote-login tool.  You can read about this extensively in
[many][xz-filippo] [places][xz-ars] [elsewhere][xz-blog].

Many people have leveraged the xz backdoor to highlight their favorite
open-source systemic issue. Jen Easterly, the head of CISA, argued that the only
way to stop another backdoor is by having more [corporate support for
open-source][cisa-open-source]. This opinion was [echoed by Meredith
Whitaker][meredith-open-source], the CEO of Signal. A similar opinion among
developers is that the only way to secure open-source is by offering some sort
of Universal Basic Income (UBI) so that developers can work on open-source full
time.

Unfortunately, money does not prevent this backdoor.

Let's think about how companies can apply money to open-source.

Companies could pay open-source maintainers directly. They could:
* Engage with the maintainer as a consultant, and pay them to fix bugs and
  implement features that are relevant to the corporation, specifically.
* Hire the maintainer as an employee, and have their full-time job be running
  the project with various amounts of ensuring the project remains useful to the
  company's goals and other company work.
* Pay the maintainer a salary to desrisk the likelihood the project goes under,
  but don't actually engage with them as a consultant.

The first approach, paying the maintainer as a consultant may sound appealing if
you've never worked full-time as a consultant. As a consultant, you have to find
contracts and do things in exchange for money. Perhaps you get yourself to a
state where you can spend most of your time working on whatever it is that you
choose, and find a few small, high-value contracts here and there to support
what you do, but that's difficult. The good news is that it's already an option!
Open-source developers in high leverage situations can do this right now.
However, being a consultant is not the same thing as working on an open-source
project for love of the game. There's a lot of other work involved in running a
business, supporting clients, and finding work. You're going to find yourself
with SLAs and contracts and wait a minute, now you're not an open-source
project, you're running a software consultancy with open code.

What about hiring maintainers as employees? Well, you still have to be an
employee.  You're going to have to do employee things like performance reviews
and goal setting. Instead of what was a self-guided open-source project, you
have a job with a salary open code and maybe open governance, but you've lost
the freedom that came with an open-source project. You have a job, and having a
job is fundamentally different from building something [as a
gift][apenwarr-open-source].

From the perspective of a single maintainer, the last approach is functionally
identical to the UBI approach, just with a higher salary. This approach doesn't
work because not only is it incredibly unrealistic, but there's no guarantees.
This is simply throwing money at open-source developers and hoping security gets
fixed. As much as it would be nice to work on whatever you want and still make a Big Tech salary, that's not how exchanging money for goods and services works.


[xz-filippo]: https://abyssdomain.expert/@filippo/112185827553387306
[xz-ars]: https://arstechnica.com/security/2024/03/backdoor-found-in-widely-used-linux-utility-breaks-encrypted-ssh-connections/
[xz-blog]: https://securelist.com/xz-backdoor-story-part-1/112354/

[meredith-open-source]: https://mastodon.world/@Mer__edith/112202731458142364
[cisa-open-source]: https://x.com/CISAJen/status/1778896930484961324


