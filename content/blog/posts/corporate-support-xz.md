---
title: "Money for nothing, commits for free"
date: 2024-05-01T15:04:13-04:00
---

In early April 2024, the open source community discovered a backdoor in XZ
Utils, a suite of tools that use the xz compression algorithm. The xz backdoor
was embedded inside liblzma, and took effect when liblzma was used in OpenSSH, a
common remote-login tool.  You can read about this extensively in
[many][xz-filippo] [places][xz-ars] [elsewhere][xz-blog].

Since then, many people leveraged the xz backdoor to highlight their favorite
systemic issue in open source. Jen Easterly, the head of CISA, argued that the only
way to stop another backdoor is by having more [corporate support for
open source][cisa-open-source]. This opinion was [echoed by Meredith
Whitaker][meredith-open-source], the CEO of Signal. A similar opinion among
developers is that the only way to secure the open source ecosystem is by
offering some sort of Universal Basic Income (UBI) so that developers can work
on open source full time.

Unfortunately, money does not prevent this backdoor. First off, remember that
aside from funding infrastructure, money is mostly only useful for open-source
projects if it can enable the maintainer to work on open source _in place of_
their current full-time job, rather than nights and weekends. A living wage UBI
doesn't reach this threshold for most software developers, who currently largely
enjoy fairly high salaries. So let's think about how companies can apply
money[^2] to open source in ways that could allow maintainers to quit their day
jobs.

Companies could:
* Engage with the maintainer as a consultant, and pay them to fix bugs and
  implement features that are specifically relevant to the corporation.
* Hire the maintainer as an employee, and have their full-time job be running
  the project. This could be a mix of ensuring the project remains useful to the
  company's goals, general open source maintenance, and other company work. For
  example, this is what Microsoft does with Electron.
* Pay the maintainer a salary-equivalent to derisk the likelihood the project
  goes under, but don't actually engage with them as a consultant.

The first approach, paying the maintainer as a consultant, may sound appealing
if you've never worked full-time as a consultant. As a consultant, you have to
find clients to provide services to in exchange for money. Perhaps you get
yourself to a state where you can spend most of your time working on whatever it
is that you choose, and find a few small, high-value contracts here and there to
support what you do, but that's difficult. The good news is that it's already an
option! Open-source developers in high leverage situations can do this right
now.

Unfortunately, being a consultant is not the same thing as working on an
open-source project for love of the game. There's a lot of other work involved
in running a business, supporting clients, and finding work. You're going to
find yourself with SLAs and contracts and wait a minute, now you're not an
open-source project, you're running a software consultancy with open code. The
concerns for something that needs to make the author money are fundamentally
different than the concerns for an open-source project.

Open-source development is enjoyable for many people because they can set the
direction and the feature set and the tech stack of the project without having
to be beholden to their users or clients. The goal of the project can be the
technology itself, rather than to provide value to users[^1]. Unfortunately,
once it becomes your source of income, you start to be beholden to your users.
If you're a consultant, you can you end up with perverse incentives to make the
open-source project _worse_ so that your users are more likely to convert in to
paying clients who want custom features that otherwise could have been open
source.

What about hiring maintainers as employees? Well, you still have to be an
employee. You're going to have to do employee things like performance reviews
and goal setting. Instead of what was a self-guided open-source project, you
have a job with a salary open code and maybe open governance, but you've lost
the freedom that came with an open-source project. You have a job, and having a
job is fundamentally different from building something [as a
gift][apenwarr-open-source]. Eventually, this starts to look like corporate open
source, which has its own [set of problems][corporate-open-source].

So if consulting doesn't work, because it's already an option and people don't
take it, and hiring maintainers as employees changes the nature of open source,
what about paying the maintainers and not making them employees?

From the perspective of a single maintainer, this last approach is functionally
identical to the UBI approach, just with a higher salary. However, this approach
doesn't work because not only is it incredibly unrealistic, but there's no
guarantees. I've only seen this accomplished [once][filippo-paid-maintainer], by
someone who walked the line between consultant and influencer. Funding
maintainers without consulting or employment agreements is simply throwing money
at open-source developers and hoping security gets fixed. As much as it would be
nice to work on whatever you want and still make a Big Tech salary with limited
accountability[^3], that's not how exchanging money for goods and services
works.

To make all of this even worse, consider the case where the open-source
project is mostly "done". A compression library for a "finished" compression
format is fairly stable, all things considered. There's bugs to fix, CI to
manage, new platforms to support. But there is not 40 hours of work each week,
nor is there a large enough target market to support a full-time consulting job.
Turning projects like this in to a consulting job risks expanding scope of the
project in a way that's actually net harmful and increases attack surface.

At the end of the day, none of these arguments about money even matter, because
regardless of whether or not the maintainer is being paid, who is paying them,
and what the expectations are of the maintainer, there is still a succession
problem! At some point, maintainers will either want to step away, or life will
force them to move on, and the project will need to be handed off or will need a
second maintainer. Where does that maintainer come from? They could still be
another [Jia Tan][wired-jia-tan]. If there was a magical pot of money paying for
maintenance, then Jia Tan could still backdoor the project, _and get paid for
it!_ What a gig!

Let's separate out the discourse about open source from the actual security
steps consumers of open source should be taking. For security, there are
tangible steps you can take to mitigate the impact of another Jia Tan:
* Have less dependencies and reduce your attack surface.
* For the dependencies you do have, ensure you can build them from source using
  build tooling that you can control, rather than build tooling defined by an
  untrusted third-party.
* If you still want to use third-party build tooling, consider avoiding projects
  that use autotools, a build system that thinks it's a good idea to invoke gcc
  around 6000 times to figure out if you're running a 30-year old version of
  Solaris. Better yet, submit patches to move projects off of autotools.
* Prefer using languages and dependency systems that have support for
  auditing[^4], and build a process in your organization for evaluating and
  updating new third-party dependencies, and tracking their security advisories.
* Avoid dependencies written in languages that could introduce a memory safety
  bug, enabling them to stop all around your application's address space. No
  need to let a bull into the china cabinet.

For the discourse, consider:
* Is your suggestion for open source actually suggestion mass societal change in a
  way that benefits me, personally? If so, consider focusing on the societal
  change bits, rather than the open source bits.
* How, specifically, would any proposal have stopped Jia Tan? Who is getting
  paid to do what, by who, and why are they getting paid? Why would paying those
  people have resulted in a different outcome?

And finally, consider that _this was a success story_. The open-source community
caught the backdoor before it percolated beyond nightly release channels. And
while it's likely that this is not the only backdoor in open-source software,
there's [no evidence][hermoine] to suggest backdoors are endemic.

Now, if only Microsoft could channel their [appreciation for
speed][microsoft-backdoor-speed] towards [Microsoft
Teams...][microsoft-teams-speed]

---

_Inspiration for the [Dire Straits title format][money-for-nothing] came from [Peter Honeyman's][honey] [NLUUG][nluug-keynote] keynote "Money for nothing, chips for free"._


[xz-filippo]: https://abyssdomain.expert/@filippo/112185827553387306
[xz-ars]: https://arstechnica.com/security/2024/03/backdoor-found-in-widely-used-linux-utility-breaks-encrypted-ssh-connections/
[xz-blog]: https://securelist.com/xz-backdoor-story-part-1/112354/

[meredith-open-source]: https://mastodon.world/@Mer__edith/112202731458142364
[cisa-open-source]: https://x.com/CISAJen/status/1778896930484961324
[apenwarr-open-source]: https://apenwarr.ca/log/20211229
[corporate-open-source]: https://www.jeffgeerling.com/blog/2024/corporate-open-source-dead
[filippo-paid-maintainer]: https://words.filippo.io/full-time-maintainer/
[cargo-vet]: https://github.com/mozilla/cargo-vet
[wired-jia-tan]: https://www.wired.com/story/jia-tan-xz-backdoor/
[microsoft-backdoor-speed]: https://www.nytimes.com/2024/04/03/technology/prevent-cyberattack-linux.html
[microsoft-teams-speed]: https://www.youtube.com/watch?v=CT7nnXej2K4
[nluug-keynote]: https://nluug.social/@nluug/112098792834106087
[money-for-nothing]: https://www.youtube.com/watch?v=wTP2RUD_cL0
[honey]: http://peter.honeyman.org/
[hermoine]: https://x.com/davidcadrian/status/1774466067177361818

[^1]: Not all open source projects run like this, and you have to balance your
  desires for users with your goals as a maintainer. But at the end of the day,
  an open source maintainer whose in it "for love of the game" can simply choose
  to not doing something and their users have to deal with it.
[^2]: This is not about "corporate open source", where a company makes a
  strategic business decision to build their product around an open source
  project. Corporate open source definitionally has corporate support, but has
  its own set of problems.
[^3]: Who wouldn't like a high-paying job with no responsibilities or accountability?
[^4]: By support for auditing, I mean the dependency manager has a concept of
  "someone in my organization, or another organization I trust, has audited this
  specific version of this dependency". An example of this is [cargo
  vet][cargo-vet].
