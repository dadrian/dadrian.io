---
title: "Hacking is Just Bugs"
date: 2026-07-16T12:45:00-04:00
images:
- img/mythos.jpg
---

Movies and video games make it seem like hacking is simply whoever is smarter at
computers breaking into someone else's system. That's not quite the case.
Hacking is the act of exploiting vulnerabilities. And a vulnerability is just a
bug.

Software has bugs. Some of these bugs are functional bugs where the software
does not work correctly. A subset of bugs will have some security impact,
meaning that the software does not work correctly in some way that results in a
negative security outcome. This could be in a direct way, e.g. by failing to
check if a user has access to some resource before showing it to them, or it
could be in a more indirect way. For example, the software could have a [memory
safety][memory-safety] bug that enables attacker-controlled remote code
execution.

We commonly refer to security bugs as "vulnerabilities". At a very high level,
hacking is a two-step process:

1. Identifying a vulnerability (i.e. security bug finding)
2. Exploiting the vulnerability

Identifying vulnerabilities and writing exploits is often referred to as
"vulnerability research". To exploit a vulnerability, an attacker has to write
code to trigger the vulnerability in a specific way such that the attacker
achieves the desired outcome. The usual goal of an exploit is to gain control of
the target's computer such that the attacker can execute attacker-controlled
(malicious) code to exfiltrate private data from the target or use the target's
computer for some nefarious purpose. Exploit writing is both an art and a
puzzle-solving challenge, perhaps best compared to solving a Rubik's cube with
extra dimensions or a Sudoku where you can't see the grid.

Some security bugs are more exploitable than others. In practice, many security
bugs are extremely difficult to exploit reliably, meaning they result in
crashes, user-visible failures, or simply don't work. An exploit that enables full
attacker-control of a victim's computer likely involves multiple vulnerabilities
chained together to bypass several layers of defenses. Chaining vulnerabilities
together is standard operating procedure for exploitation, and is effectively a
requirement to operationalize a vulnerability.

Both vulnerability identification and exploit writing are learnable skills, but
with niche barriers to entry. Most programmers, myself included, are not good
vulnerability hunters and are even worse exploit writers. People who are good at
(and enjoy!) writing exploits tend to be people who like puzzles. To be a good
exploit writer, you need to be a particular type of puzzle solver and
understand low-level programming details. Both of these skills are completely
learnable without any real barriers to entry. But, most people don't like doing
puzzles, and even fewer of them enjoy doing puzzles and reading low-level
machine code.

For most people learning to program, instead of learning low-level programming
to solve the types of problems and puzzles that appear as part of exploit
writing, most programmers learn instead how to build things. This is not to say
that building and exploiting are mutually exclusive skills. However, building
tends to be a more enjoyable path for most people. And so the set of people who
actually put in the work to become very good at bug hunting and exploit writing
is much smaller than the set of people who are good at low-level programming.

For better or for worse, AI is good at puzzle-solving and low-level programming,
and so AI seems to be a [good vulnerability researcher][tqbf-vuln-research]. This
is not because AI is doing anything we didn't already know how to do, it just
has the patience for a specific type of problem that many people hate. I work in
security and I am both bad at exploit-writing and don't enjoy it. I also don't
like puzzles. I much prefer building systems to solve the general case. Current
AI coding agents do not have this preference and will work on anything for as
long as you have the budget for tokens.

AI coding agents have been good at bug hunting for a while. [Mythos][mythos]
appears to be better at leveraging those bugs by actually writing exploits. But
Mythos is not magically breaking into computers in a way we could not before, it
is providing the attention needed to do the same security work we've been doing
for years.

This is not to downplay the importance of AI or to suggest that AI bug hunting
is fake. This is to contextualize what it means when someone goes on video and
pontificates about how the AI are chaining novel vulnerabilities together. That
is simply how hacking works. What's new is that vulnerability research can now
(somewhat) automated.

There's another step, after writing an exploit, which is actually
operationalizing the exploit and using it to achieve some goal. This is the
difference between knowing how to play ball, and actually winning in a
competitive game. Real-world exploitation has broadly not been supply bound.
There's been enough bugs in software that the people who are actually
operationalizing exploits ([law enforcement][cno] and [state-level
adversaries][nk-hacking], mostly) have not been supply-bound. AI finding more
bugs increases supply, but it's not clear (yet) that it increases demand for
computer network exploitation. Perhaps we'll see a [Jevons paradox][jevons], and
demand will increase. But that hasn't happened yet. Society seems to be working.
Most people with the vulnerability research expertise to operationalize exploits
choose to do so lawfully within the defense industry (or they got sidetracked
into becoming a high-earning engineer), rather than choosing to pursue a life of
crime.

Because hacking is just bugs, that means we have a good defense against
hacking---don't have bugs. This is certainly easier said than done, but the vast
majority of exploitable vulnerabilities are due to a specific class of
vulnerabilities---[memory-safety bugs]---which we do know how to
_systematically_ prevent. Unfortunately, this requires a lot of work, but you
won't [patch yourself out of a vulnpocalypse][gaynor-vuln] if you're one of the
software projects where [memory safety actually matters][dadrian-memory-safety].


[memory-safety]: https://alexgaynor.net/2023/oct/02/defining-the-memory-safety-problem/
[tqbf-vuln-research]: https://sockpuppet.org/blog/2026/03/30/vulnerability-research-is-cooked/
[cno]: https://en.wikipedia.org/wiki/Computer_network_operations
[nk-hacking]: https://en.wikipedia.org/wiki/Lazarus_Group
[gaynor-vuln]: https://alexgaynor.net/2026/jul/15/you-cant-bugfix-your-way-out-of-the-vulnpocalypse/
[dadrian-memory-safety]: https://dadrian.io/blog/posts/memory-safety-and-sandboxes/
[jevons]: https://en.wikipedia.org/wiki/Jevons_paradox
[mythos]: https://www.anthropic.com/glasswing
