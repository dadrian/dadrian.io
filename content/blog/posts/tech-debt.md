---
title: "Tech Debt? I don't believe it exists."
date: 2022-07-06T20:00:00-05:00
draft: false
---

{{< figure src="/img/rodents.gif" title="Rodents of Unusual Size? I don't believe they exist." class="df">}}

There’s endless discourse around tech debt. [Kellan][kellan] has some really
good [categorizations][kellan-debt] of different types, [Will
Larson][will-larsen] has a great explainer of organization debt in [his
book][elegant], and I also like the idea of [product debt][product-debt].
Throughout my career,  I’ve been an engineer complaining about tech debt, a
manager prioritizing (and deprioritizing) addressing tech debt, and a product
manager, where I assume I primarily inspire the creation of new tech debt.

However, I’ve landed on the best way to think about tech debt is that it doesn’t
really exist. This is not to say that every codebase is immaculate. Instead, I
like to think of the world as “the thing you are trying to do”, and three other
things:
* Things causing problems now.
* Things that will be causing problems soon.
* Things that are not causing problems

Let’s break them down.

### Things Causing Problems Now

Sometimes you have a service or a codebase that is constantly causing fires.
This could be outages, embarrassing bugs, crashes, etc. When this keeps
happening, this is rarely because an engineer didn’t implement something as
intended, but because of some sort of architectural decision with unforeseen or
delayed consequences. You can’t fix this by constantly reacting to the next
problem, at some point you have to chop it off at its source. At this point, the
Thing Causing Problems needs to be scheduled in as a Thing To Be Done. It’s just
like any other work. This doesn’t mean drop everything, it means the system
change / refactor / systemic fix needs to happen, and it should get prioritized
just like anything else you might work on.

### Things Causing Problems Soon

There’s many ways that something could cause problems soon. This could be an
imminent scaling issue e.g. “in two months we will run out of disk space in our
Elasticsearch cluster unless we…”. It could be a velocity issue, where adding
features to a specific project takes too long because of a design that’s no
longer suitable for the situation. It could be a product issue, where adding new
features gets slowed down by the existence of old features that need to be
deprecated and removed. It could be not keeping your dependencies up to date,
leading to a supply-chain N-day you’re unable to patch or a framework that’s
stuck on a version with no documentation.

Things Causing Problems Soon are often actually a dependency on landing some
aspect of the work to be done, and are best addressed as part of the rest of the
Work To Be Done, when appropriate. You address Things Causing Problems Soon by
finding the right point at which solving them makes sense as part of Work To Be
Done. As “soon” approaches “now”, they’ll either become a fire (which might be
OK!), or fixing them will clearly become a dependency of or priority over other
Work To Be Done. If this never happens, then you might actually be dealing with…

### Things That Are Not Causing Problems

Some things are not problems, and don’t have to be changed. Changing from
Framework A to Framework B because it’s what you would do if you were starting
from scratch, even though Framework A is still working fine. Adding more tests
to a part of the codebase that’s not known to be buggy and rarely changes.
Replacing working generated code with generic types.

This is not to say that frameworks never need to be migrated, or that code never
needs to be refactored, or that tests don’t need to be written. Under any
definition, tech debt is not about personal preference (subject to your ability
to recruit and hire engineers to work on a project). A project shouldn’t
increase in priority under the guise of being tech debt, if it’s not actually
causing a problem now, or causing a problem soon.

Sometimes people interpret the idea of Innovation Tokens as “you get to make
three decisions about your tech stack for fun without any justification at all,
and anything that has any form of justification doesn’t count”. I once saw
someone argue that Tailscale forking Golang didn’t count as an innovation token
because many of the developers had experience working on the Go compiler.
Forking Golang is definitely an innovation token; forking Golang with a team
that understands the Go compiler is a decision that makes sense as a place to
spend an innovation token when it solves a problem for you. Forking Golang when
you don’t understand the compiler might be fun, but certainly doesn’t make
sense.

Similarly, something that isn’t causing problems now and isn’t causing problems
soon, and isn’t the task to be done, doesn’t need to be done.

### So what does this all mean?

Sometimes people want to schedule tech debt in, saying things like “20% of each
sprint should be dedicated to tech debt” or allocating a debt fix-it week. This
is an anti-pattern that indicates you don’t actually know what your problems
are, or where you want to go and why you want to go there.

If you can’t identify work in any space between “feature” and “tech debt”, you
don’t actually understand the work you’re trying to do or the problem you’re
solving, let alone the problems you’re actually facing. Good work enables new
features and removes classes of problems. Eventually, the new features bring
about new complexity which bring up new problems. Getting a handle on tech debt
isn’t about taking a break from future work, it’s about working on the right
problems at the right time, for the right reasons.

### What if this article was all bullet points?

* Don’t treat tech debt as separate from feature work
* Understand what you’re doing and why
* Work on things causing problems now or causing problems soon

[kellan]: https://kellanem.com
[kellan-debt]: https://kellanem.com/notes/towards-an-understanding-of-technical-debt
[will-larsen]: https://lethain.com/
[elegant]: https://press.stripe.com/an-elegant-puzzle
[product-debt]: https://andrewchen.com/product-design-debt-versus-technical-debt/

