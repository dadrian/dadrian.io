---
title: "Hacking is Just Bugs"
date: 2026-06-301T13:02:00-04:00
images:
- img/late-show-mugs.jpg
---

We're in the midst of an AI-driven "vulnpocalypse", but what actually is a
vulnerability? And what is hacking?

Movies and video games make it seem like hacking is simply whoever is smarter at
computers breaking into someone else's system. That's not quite the case.
Hacking is the act of exploit vulnerability. And a vulnerability is just a bug.

Software has bugs. Some of these bugs are functional bugs where the software
does not work correctly. A subset of bugs will have some security impact,
meaning that the software does not work correctly in some way that results in a
negative security outcome. This could be in a direct way, e.g. by failing to
check if a user has access to some resource before showing it to them, or it
could be in a more indirect way. For example, the software could have a [memory
safety][memory-safety] bug that enables in attacker-controlled remote code
execution.

We commonly refer to security bugs as "vulnerabilities". At a very high level,
hacking is a two-step process:

1. Identify a vulnerability (i.e. security bug finding)
2. Exploiting the vulnerability

To exploit a vulnerability, an attacker has to write code to trigger the
vulnerability in a specific way such that the attacker achieves the desired
outcome. Exploit writing is both an art and a puzzle solving challenge, perhaps
best compared to solving a Rubik's cube with extra dimensions or a Sudoku where
you can't see the grid.

Some security bugs are more exploitable than others. In practice, many security
bugs are extremely difficult to exploit reliably. An exploit that results in
full attacker control of a victims computer likely involves multiple
vulnerabilities chained together to bypass several layers of defenses.





[memory-safety]: https://alexgaynor.net/2023/oct/02/defining-the-memory-safety-problem/
