---
title: "On Branded Vulnerabilities"
date: 2016-04-21T00:00:00-05:00
draft: false
---

An article has been going around the Internet recently, arguing that branded
vulnerabilities are no longer helping application security and have instead
become an instance of the "boy who cried wolf" phenomenon.

The Badlock bug is a textbook example of over-hyping vulnerabilities for
marketing purposes rather than for promoting good security hygiene. The
disclosing team's dubious motivations have been written about extensively
over the last several weeks, and "thought leaders" are currently mocking the
badlock hashtag on Twitter, including a full-blown parody bug called Sadlock.

However, I take issue with the claim that the security community needs to
move past branded vulnerabilities. **The security community doesn't need to
move past branded vulnerabilities; it needs to move past bullshit marketing.**

As a graduate student working in computer security, some of my research
centers around using Internet-wide scanning for security. Part of this work
entails measuring the impact of different vulnerabilities. At a very broad
level, Internet-wide scanning allows us to answer questions like "How many
trusted HTTPS servers are vulnerable to some attack?" and "What networks have
the largest number of vulnerable hosts?".

In the past two years, I've been involved in vulnerability measurement for
Heartbleed and POODLE, as well as the disclosure and measurement process for
FREAK, Logjam, and DROWN.

Let's start with Heartbleed, which had a disclosure snafu when the original
vulnerability website and OpenSSL patch went live before many Linux
distributions even knew anything was wrong. Regardless, within 48 hours of
disclosure, my research group was able to post some statistics about who was
vulnerable, based on Internet-wide scanning. It's unfortunate that
Codenomicon didn't provide any of these statistics, nor did they provide a
way for sysadmins to test if their servers were vulnerable. Luckily, to fill
this gap, Filippo Valsorda (@FiloSottie) put together the Heartbleed test
shortly after the disclosure. Between the disclosure site, our statistics,
and Filippo's test, we now had enough accessible data sources to be useful
to professionals, researchers, and the general public alike.

Having experienced the mess that was Heartbleed, every disclosure team I've
been involved with has worked to make an actually useful vulnerability
website. If you take a closer look at DROWN website, you can see that we
provided an accessible description of what the vulnerability was, a technical
paper describing the details, statistics about who was vulnerable in order to
help readers understand the real-world impact, and a tool to test whether a
website you administer or visit was vulnerable.

Sometimes technical issues limit our ability to provide comprehensive tests.
Sometimes we run out of time before the vulnerability is publicly released,
and we're not able to calculate every statistic or implement every test.
Regardless, the goal is always to disseminate data in a useful manner
accessible to a technical audience, without requiring the reader to be a
security expert. Being "unbearable academics" means we don't have a direct
monetary incentive in creating a disclosure website, so we don't have to try
to use it to sell a product - we're just trying to let people know about
issues we think are important.

Furthermore, we only go through the effort of making a disclosure website if
the vulnerability is high-impact, or is broadly relevant to society or public
policy. For example, FREAK, Logjam, and DROWN were each caused by legacy
regulations restricting the strength of cryptographic products that could be
exported from the United States. Because of this, they provide vital
historical context for the current debate surrounding the use of end-to-end
encryption in Apple v. FBI and the Feinstein-Burr legislation.

Unfortunately, when others over-hype or parody for marketing purposes, this
impacts legitimate researchers' ability to publicize important results.
Whether or not their intentions were benign, they end up furthering the "boy
who cried wolf" effect.

Finally, statistics we do publish are honest and as representative as
possible of actual vulnerable populations. Statistics should have both a
numerator and a clear denominator. The denominator should be representative
of the full population, not some biased vulnerable subset.

So what does make a good vulnerability disclosure website? There's no hard
and fast rule, but I'd say the best have most of the following:
- A clear description of the vulnerability, accessible to a general audience.
  This should explain enough of the attack to understand who is vulnerable and
  why, but might not necessarily provide all the details of how the
  vulnerability works.
- Statistics that provide an honest assessment of the vulnerability's impact,
  to help measure its importance.
- Instructions on how to patch or workaround the vulnerability on common platforms.
- A test for end-users and system administrators to help identify vulnerable
  devices they might use or manage.
- Technical details available to those who are interested.

(I will note that the FREAK, Logjam, and DROWN disclosure websites have all
of these qualities.)

Beyond that, the website should not be published until patches are available.
If Heartbleed didn't merit a disclosure website two weeks in advance of the
patch date, your vulnerability probably doesn't either.

So please, continue making disclosure websites for important vulnerabilities.
But stop making useless, hype-filled websites on behalf of your marketing
team. You're ruining the ability to publish for people who are trying to do
truly useful work.

Questions? Comments? Concerns? I'm @davidcadrian on Twitter. This post
represents my personal thoughts, and does not necessarily reflect the
opinions of my coauthors.

_Thanks to Chris Dzombak (@cdzombak), Kyle Lady (@kylelady), and Thomas Ptacek
(@tqbf) for reading drafts of this post._

_Previously published on Medium._
