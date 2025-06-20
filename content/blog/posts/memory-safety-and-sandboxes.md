---
title: "Sandboxes? In my process? It's more likely than you think."
date: 2025-06-20T08:55:08-04:00
uses: ["code"]
---

Discussions around memory safety often focus on choice of language. While it's
clear that the vast majority of programs that do not fundamentally need to do
unsafe operations, such as programs that manage an [MMU][mmu] or [memory-mapped
IO][mmio], should adopt a safer language than C or C++. For programs that need
to be native, this can be Rust, Zig, Jai or others. If you can handle a garbage
collector, there's plenty of options with performance. And if you don't care
about efficiency at all, there's Typescript and Python. Not all of these
languages are as "safe" as Rust, but _all_ are better than C and C++, at minimum
because the tooling doesn't actively hate the developer[^1]. I don't want to
wade into that discussion here.

Choosing a language is inherently a decision that is made at the start of a
project. It is much harder to migrate an existing project in C or C++ to a safer
language over time, than it is to start a new project today in a safe language.

I'm not going to say this is impossible, or that you _can't_ or _shouldn't_
migrate existing programs to safer languages. And sometimes people just do
things in open-source, and that's [part of the fun of it][avery-gift].

\TODO connect back to why this question is related to the previous

But it's clear that memory safety is more important to some projects than
others. Let's break that down into three categories: programs, platforms, and
insane bullshit[^2].

### Programs

Most programs do not need to be rewritten or migrated to a memory-safe language.
If a program primarily runs on a single computer or a server, does not talk to
_arbitrary_ network or hardware clients, and does not execute untrusted code,
there is limited security benefit to removing memory-safety vulnerabilities.
There may be ecosystem benefits to [migrating tools like coreutils to
Rust][alex-coreutils], but `ls` is not an entry nor LPE vector.

I will further claim that this category includes some common server
infrastructure like Postgres! While it is extremely important for Postgres to
avoid memory-safety issues and race conditions leading to data corruption, if a
memory-safety vulnerability in your database is being exploited for RCE, you are
not using your database correctly.

Databases are interacted with by a set of semi-trusted clients (other servers)
that are credentialed and using a limited subset (prepared statements) of a
defined syntax (SQL). I do not expect Postgres to be resistant to any
maliciously crafted SQL statement---I expect applications to not allow users to
craft malicious SQL since that's a vector for SQL injection. So while I expect
there are memory safety bugs in Postgres, I also expect that they are largely
not reachable from ordinary injection-resistant usage.

Rather than finish defining this category, it's best left as the things that
aren't _platforms_.

### Platforms

The code where memory safety really matters is in platforms, which I'm defining
as anything that runs other untrusted code, manages an untrusted network, or
communicates with untrusted hardware. Some examples include operating systems,
web browsers, virtual machine monitors (VMMs), hypervisors, and serverless
worker cloud environments[^4].

\TODO define capability

Breaking this down further, this is basically three types of programs that all
manage some sort of capability:
- **Programs with the specific purpose of running other people's code.**
  Operating systems run arbitrary programs and apps of dubious provenece and
  provide them capabilities, such as \TK. Web browsers do the same, but the code
  is implemented in Javascript and WebAssembly and the DOM, and isn't native.
- **Programs that need to manage external hardware** are also effectively
  providing a capability to other programs on the same device, and in some
  cases, also directly executing code or managing memory, but in a different
  context than the CPU.
- **Programs that communicate over the network**, if you squint, are basically
  also providing some sort of capability, and need to potentially mediate
  against either the resource (remote end of the network connection) or the
  requestor being malicious.

Platforms are programs and systems that provide capabilities, up to and
including code execution, to something else _that is untrusted_[^5], as opposed
to solely running some sort of transformation of inputs. Memory safety bugs in
these programs result in security issues, and [given enough bugs, the security
architecture becomes irrelevant][ian-beer-bugs].

### Insane Bullshit

There's a final class of programs that usually exist in the context of some
platform, but have such odd execution properties that rewriting them in a
memory-safe language doesn't actually achieve what we normally mean when we say
a program is memory-safe.

This raises the quesetion---what is the actual security property we get from
memory-safety anyway? If we take the usual description of memory-safety that all
pointers are guaranteed to only point at live objects of the same type (size)
that they were pointing to when the memory was allocated, without any new
allocations in between, what do we actually gain from this?

The best description of this proprety comes from [Thomas Dullien][halvar] in his
[presentation at DistrictCon][flake-memory-safety]. The basic idea is that a
program is, in theory, intended to be a finite-state machine and do some sort of
computational task, as written by the programmer. During the execution, the
program follows a set of transitions in the state space defined by the
programmer. An attackers goal is to find some way to transition the state
machine off of its intended path and into a weird state, such that as it follows
the transitions defined by the programmer, it gets into weirder and weirder
states that eventually do something the attacker intends (such as run malicious
code), rather than what the programmer intended.

The set of states most programs can be in is impossibly large, but it is still
considerably smaller than the set of states a computer _could possibly_ be in.
Once an attacker find a memory-safety bug, they begin the process of walking the
weird state machine. Memory safety attempts to build another wall between "the
set of states the programmer intended" and "the set of states". This would be
"the set of memory-safe states", defined as the states in which all pointers
still all have the memory-safety property defined above. This drastically
reduces the attackers ability to enter a weird machine[^6], if, once they find a
bug, they are still forced to stay within the memory-safe states, rather than
any state. Other mitigations and technologies such as [W^X][wxorx] and
[control-flow integrity][CFI] (CFI), also attempt to constrain the state space,
but empircal evidence suggests they do not constraint the state space enough to
be as as effective as memory safety.

The main way in which we achieve strong memory safety (and performance) is
compile-time checks of properties that we believe (or have proved!) are
equivalent to memory-safety. The Rust borrow checker enforces that there is only
one mutable reference to any object at a time, and no references are dangling,
and that a reference of one type cannot be switched to a reference of another
type. In practice, this results in a memory-safe program (subject to the user of `unsafe`[^6]),

## Real Life

Unfortunately, the most important code to secure via just about every metric is
the insane bullshit. In web browsers, JITs and the GPU are the most exploited
components and some of the most difficult to secure. [V8][v8] is one of the
largest sources of both known in-the-wild (zero-day) exploitation in Chrome, and
one of the largest sources of high+ severity stable-impacting[^3] bugs. And, as
discussed above, rewriting a JIT in a safe language might help with certain bugs
in the runtime, but it won't solve the problem that _logic_ bugs resulting in
miscompilations leading to runtime type confusion are fundamentally _equivalent
to memory safety bugs_ leading to RCE.

### Money





[mmu]: \TODO
[mmio]: \TODO
[alex-coreutils]: https://alexgaynor.net/2025/mar/22/coreutils-in-rust/
[v8]: https://v8.dev
[v8-sandbox]: https://v8.dev/blog/sandbox
[reasons]: https://alexgaynor.net/2025/mar/06/things-have-reasons/
[avery-gift]: https://apenwarr.ca/log/20211229
[dadrian-isolate-tweet]: https://x.com/davidcadrian/status/1834645627147329688
[ian-beer-bugs]: \TODO
[flake-memory-safety]: https://docs.google.com/presentation/d/1-CgBbVuFE1pJnB84wfeq_RadXQs13dCvHTFFVLPYTeg/edit?slide=id.p#slide=id.p
[wxorx]: \TODO
[cfi]: \TODO

[^1]: \TODO expand on how Zig or Jai tooling makes your program more likely to be correct
[^2]: Spoiler alert! It's JITs.
[^3]: A high severity bug is loosely defined as a memory-safety bug that could
  potentially lead to RCE in the renderer. A stable-impacting bug means that the
  bug is present in a stable release Chrome, meaning any security bug that is
  only ever present in HEAD but is fixed before ever being released is excluded.
  A critical security bug is RCE in a high-privilege (i.e. browser, GPU) process.
[^4]: [It's called an isolate, what do you mean it's not sandboxed?][dadrian-isolate-tweet]
[^5]: If it was trusted, you could just give it direct access and not have a
  capability in the first place.
[^6]: If you think of memory safety as trying to reduce the ways an attacker can
  get into a weird machine, than it's clear that the existence of unsafe blocks,
  while they could potentially violate the safety guarantees of the rest of the
  program if the attacker is able to enter a weird machine from the unsafe code,
  is not nearly as risky as unsafe C/C++ code generally, in which an attacker
  can potentially entire a weird machine from _any_ line of code.
