---
title: "Security teams are not a lottery ticket"
date: 2026-02-22T17:53:00-07:00
uses:
  - svg
---

Peter Thiel has a four-quadrant framework for how people think about the future,
described both in his 2013 SXSW talk, [“You are not a lottery
ticket”][sxsw-thiel], as well as in his book, “Zero to One”. Thiel’s commentary
is about society writ large and part of an ideological framework for investing
in startups. Instead, let’s use Thiel’s framework to understand security teams,
including both [teams that secure products and teams that secure
organizations][dadrian-teams]. To do this, we’ll first go through the framework
and the four quadrants themselves, then we’ll map security teams and well-known
security initiatives to the quadrants.

## The four futures

{{% rawhtml %}}
<div class="svg-wrapper">
  <object data="four-futures-names.svg" type="image/svg+xml" role="image"></object>
</div>
{{% /rawhtml %}}

Thiel’s four quadrants are the cross-product between _pessimistic_ and
_optimistic_ views of the future on the y-axis, and _determinate_ and
_indeterminate_ views of the future on the x-axis.

1. **Determinate Optimistic:** The belief that the future will be better, and that
  we can plan for it, specifically. You commit to a concrete vision, make a
  plan, and keep working towards it. These futures have explicit end states,
  rather than vague ideas of “progress”, and are represented by major postwar
  infrastructure and engineering projects such as the moon landing and
  interstate highway system.
2. **Indeterminate Optimistic:** The belief that the future will be better, but we
  don’t know how. We try to “hedge” and build a portfolio or take a cut of
  everything, to share in the generic upside. This leads to a focus on finance,
  law, and process, rather than on doing specific things. There doesn’t need to
  be a plan, we can just be iterative. You can’t justify any single bet as a
  winner, only the idea that something in the portfolio will win.
3. **Indeterminate Pessimistic:** The belief that no matter what anyone does,
  things will simply [get worse][worst-so-far], but in a way that is unknown
  enough that there is no clear plan to fix it. This leads to stoicism, an
  acceptance of a negative outcome, possibly paired with an increased desire to
  insure or hedge against every possible downside.
4. **Determinate Pessimistic:** The belief that the future is known, but the best
  you can do is what we have now. In this world, you should copy what works best
  now, because things will never get better, and you should save for the future,
  because things will never get any easier.

{{% rawhtml %}}
<div class="svg-wrapper">
  <object data="four-futures-examples.svg" type="image/svg+xml" role="image"></object>
</div>
{{% /rawhtml %}}

Thiel makes the case that optimistic, determinate views of the future where you
execute on a plan towards a vision of something better are what enable hard work
to lead to success, whereas indeterminate views of the future (the right side of
the graph) are primed to attribute any success to luck, and anything negative to
being unlucky, resulting in the financialization of everything.

Thiel argues that you, yourself, should aim to be building a determinate
optimistic future. He says that you can do this by identifying some “secret”,
that you know to be true, that other people either disagree with or don’t act
on, and leveraging that asymmetric advantage to build the future you want and
win.

## Security Teams

Security teams are not the target audience, but Thiel’s framework is a useful
lens for understanding what makes some security teams better than others.
Security teams have asymmetric information between attackers and defenders, and
a delayed feedback loop. This means it can be difficult to attribute success and
failure to luck or design. This is where the four quadrants come in.

Let’s map security teams into the quadrants.

1. **Determinate Optimistic:** A security team that takes ownership of security
  outcomes, has a vision for how to fundamentally stop classes of security
  problems, and executes on a plan to get there.
2. **Indeterminate Optimistic:** A security team based on hope. This team does a
  lot of things, or buys a lot of products, or talks a lot of talk, and expects
  that it will all work out, but with no particular plan for how or why things
  will work out.
3. **Indeterminate Pessimistic:** A security team that assumes things will
  always get worse, in spite of their best efforts. At best, they can slow down
  the fall into the abyss. This team believes they will ultimately lose.
4. **Determinate Pessimistic:** A security team that can no longer think for
  itself and is solely a cost of doing business.

{{% rawhtml %}}
<div class="svg-wrapper">
  <object data="four-futures-security.svg" type="image/svg+xml" role="image"></object>
</div>
{{% /rawhtml %}}

### Determinate Optimism

Similar to Thiel, security teams should aim for the first quadrant. Good
security teams are the _determinate optimistic_ teams. These teams believe that
security can get better, and they understand how to make things better. The
security team has a vision as to where they’re going and how they’re going to
fundamentally stop classes of security problems, and executes on a plan to get
there. They take ownership of security outcomes, and ensure that they improve
over time. Great security teams have overwhelmingly positive security outcomes.
They achieve this by eliminating classes of risk, making compromise boring,
accurately measuring problems and solutions, and owning the final
outcomes---good or bad.

This is easier said than done, and many teams never get there. Instead, they end
up in one of the other quadrants.

### Indeterminate Optimism

Some security teams might want to implement processes and policies without
actually taking ownership of security outcomes. This brings us to the second
quadrant, the _indeterminate optimistic_ teams. Just like in the original
quad-chart, these teams are characterized by portfolio thinking as a form of
hope.

For teams responsible for securing an organization, hope manifests as buying
fancy security products and having the latest intelligence feeds, but working
from checklists written at a bird’s eye view, and assuming everything will work
out. These teams frequently can’t even use their own tools, let alone tell if
their own tools are working. They don’t know what control will stop the next
incident, so they instead do a little bit of everything.

For teams responsible for securing a product, “hope” is bottom-up security
engineering with no plan to win. In these organizations, every security engineer
is doing something that in isolation seems reasonable. The hope is that in
aggregate, the security outcomes will be positive. For some particularly
technically competent teams in high-tech, relatively straightforward product
organizations, this can work out. But in many cases, it just feels like progress
because the activity is high, and yet there’s no actual change in the
zero-to-one---the fundamental underlying security problems all still exist
exactly the same as they did before. Bottom-up security work without an end
state is more portfolio thinking. Every engineer and project is a bet, and the
team is hoping that success emerges statistically. This is rational only if you
believe outcomes are fundamentally unpredictable and not engineerable.

Ironically, the “Secure by Design” push from CISA during the Biden
administration, while an optimistic view of the future where products cannot
even be insecure, is actually an indeterminate vision of the future, and a
variant of the hope approach. While many organizations signed the secure by
design pledge, the lack of definitions and requirements from CISA around what it
means to be secure by design make the pledge vacuous. Signing the pledge is a
way to signal virtue without doing any work. What little guidance CISA does
provide is unhelpful, making vague high-level recommendations like “have a
memory safety roadmap”, without explaining how to identify software that
[actually needs memory safety][dadrian-memory-safety]. Some of the guidance is
actively harmful, like suggesting the best way to migrate to post-quantum
cryptography is to [inventory keys][dadrian-key-inventory].

This is a classic example of portfolio thinking. Secure by Design is a desired
upside and outcome---who doesn’t want secure products!---but it barely defines
mechanisms and avoids commitment to a specific path and allows each signer to
interpret compliance however they want. It’s asking everyone to invest in
something that seems like security, and then leaving them space to take credit
for the winners. No one who signed the pledge has to say what class of security
issues will be solved, by what change, on what timeline, and with what impact.

### Indeterminate Pessimism

Indeterminate pessimism is what happens when a security team concludes that
outcomes can neither be predicted nor improved. It is portfolio thinking, but
without hope. These are the security teams that believe they can at best, slow
the decline. These security teams will fail.

[Michał Zalewski][lcamtuf] (lcamtuf) describes a team sliding from indeterminate
optimism to indeterminate pessimism in his post ["How Security Teams
Fail"][lcamtuf-fail]. Initially, if the security team contains enough smart
people doing enough work, there’s a decent chance the portfolio is initially
successful and security outcomes improved in some ways, even if no one has any
particular opinions on how or why.

As the security team grows from small and scrappy, to large and established, it
can accumulate a set of projects and culture that are disconnected from the
engineering team and business objectives at large. Then, as the actual risks
change over time, the security team fails to address them because they’re
already busy with their own self-defined projects. As the tides change, the work
changes, or the staffing changes, the team has a slow burn into indeterminate
pessimism and falls into a doom loop. No matter what they do, outcomes seem to
get worse. These teams deemphasize planning, refuse to measure, and stop taking
ownership of outcomes.

An indeterminate pessimistic security team might even have identified the
correct problems, but been unable to address them because the team never made an
actual plan for the determinative optimistic future where the problems were
solved. This could be because it would have required the security to have to
work on projects they didn’t like, or change how they operate. If your identity
is defined by the problems, then any solution can feel like an attack. Besides,
who wants to work on tooling?

When security teams view security as a game of pure luck/odds rather than a
solvable engineering problem, it leads to fatalism about their own efficacy and
a dereliction of responsibility. They stop doing the hard work of definite
design and settle for insurance, blame mitigation, and "accepting risk”. Or
worse, they assume the game is already over. This is a particularly easy trap to
fall into because of the asymmetry of information and goals between attackers
and defenders. Attackers only need one bug and are trying to hide, but defenders
are responsible for all the bugs. It’s easy to start thinking that if attacks
only get better, and well-engineered exploits are broadly undetectable by end
users, then how can we know that there isn’t some sort of mass exploitation
dragnet across all our users already? And if there isn’t now, won’t there
definitely be one in the future? Maybe all of our open-source dependencies are
already backdoored! To this, I simply offer my favorite quote from [H.
Granger][dadrian-hg-tweet].

This style of thinking leaves space for vendors to sell coping mechanisms.
“Assume breach” is the security mindset that starts with the premise that the
attacker is already inside. If your security plan collapses as soon as an
attacker gets any foothold, then you don’t have security, you’re back in a
variant of the hope approach. There’s two approaches to the assume breach
mindset---you can make it so that it truly doesn’t matter if the attacker is
inside, or you can optimize for damage control by having speedy detection and
remediation by a security operations center (SOC).

In practice, the most common version of the assume-breach mindset sold by
vendors is the damage control variant. It is permanently accepting the
whack-a-mole approach of SOC-based security, and rebranding it as
forward-looking and cutting-edge. The vendors that do this are often selling
extended detection and response (XDR), which is when the endpoint security agent
(EDR) is correlated with non-endpoint data in an incident-first alerting
product. Assume-breach defenders can try to “No True Scotsman” their way out of
this, but in reality, assume breach means XDR and a SOC and an incident-response
team rebranded as threat hunting that looks inward.

While these things aren’t bad, and this flavor of assume breach is better than
burying your head in the sand while using a firewall as the first and only line
of defense, this approach isn’t actually building towards resolving any
problems. It is at best, the security equivalent of buying business interruption
insurance. An assume-breach strategy that starts with buying telemetry and
driving down time to remediation in your XDR is admitting you’re in the
compensating controls phase of a pessimistic future where it’s determined that
you’re owned, and that you can’t figure out how to do anything better. The
determinate optimistic alternative is a resilient, architecture-first approach
to security that reduces attack surface, cuts off classes of risks, and makes
systems (and compromise!) boring.

### Determinate Pessimism

The last quadrant is _determinate pessimism_. These security teams act as a
"Department of No" that only understands how to incrementally tweak existing
policies. They copy "best practices" from other companies or perceived
authorities without understanding if those practices are relevant to their own
unique product or organization. At many organizations, security is increasingly
viewed as similar to finance---a documentation, compliance, and controls
organization, rather than as an engineering function. It is not considered an
engineering function that designs and builds safe systems. This is in line with
the increasing financialization and focus on process and law that begins in the
indeterminate futures and solidifies in the determinate pessimistic future.

These teams are stable, but sterile. They hit their compliance guidelines, buy
their cyberinsurance, and ideally, maintain breach costs below some financially
acceptable target. But they’re not really going to secure anything. They’re a
cost of doing business, and one of those costs is paying for identity theft
monitoring services after a class-action lawsuit.

## So what?

This framing is nothing more than security team archetype botany. You can argue
the exact positioning of any particular security team archetype in the quad
chart, and claim some value by being more precise or accurate. That’s ultimately
not very useful. What’s useful is recognizing that only one quadrant produces
results.

In other words, the value is not in classifying all the things, it’s in
understanding what needs to change to get from where you are now, to a world
where you’re building the right future. The winners all look the same. Good
security teams all resemble one another, each bad security team is failing in
its own way.

Determinate optimistic teams are not implementing processes and policies without
owning outcomes. They are not a portfolio of bottom-up security work or
arbitrary products, hoping for the best. They're not fatalists and they haven't
given up.

What’s the difference between your security team and one that’s in the
determinate optimistic quadrant? One way to check this is to see if you can
articulate what will be better in 1-3 years than it is now, and be able to
provide a hypothesis about how you're going to make that happen. Can you
describe a specific end-state and a mechanism to get there? If you can't, and
instead you expect to do more of the same, you probably have a portfolio and no
real goals and you're not actually trying to win.

If you’re on a security team and you’re not executing a real strategy to win,
then you are not doing your job.

Do your job.


[sxsw-thiel]: https://www.youtube.com/watch?v=iZM_JmZdqCw
[thiel-ross]: https://www.nytimes.com/2025/06/26/opinion/peter-thiel-antichrist-ross-douthat.html
[dadrian-teams]: https://dadrian.io/blog/posts/security-engineering-roles/
[worst-so-far]: https://www.youtube.com/watch?v=bfpPArfDTGw
[dadrian-memory-safety]: https://dadrian.io/blog/posts/memory-safety-and-sandboxes/#programs
[dadrian-key-inventory]: https://dadrian.io/blog/posts/stop-inventorying-keys/
[lcamtuf]: https://lcamtuf.coredump.cx/
[lcamtuf-fail]: https://lcamtuf.substack.com/p/how-security-teams-fail
[dadrian-hg-tweet]: https://x.com/dadrian/status/1774466067177361818?s=20
