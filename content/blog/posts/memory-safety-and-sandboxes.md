---
title: "Sandboxes? In my process? It's more likely than you think."
date: 2025-06-20T08:55:08-04:00
---

Discussions around memory safety often focus on choice of language. While it's
clear that the vast majority of programs that do not fundamentally need to do
unsafe operations, such as programs that manage an [MMU][mmu] or [memory-mapped
IO][mmio], should adopt a safer language than C or C++. For programs that need
to be native, this can be Rust, Zig, Jai or others. If you can handle a garbage
collector, there's plenty of options with performance. And if you don't care
about efficiency at all, there's Typescript and Python. Not all of these
languages are as "safe" as Rust, but _all_ are better than C and C++, at minimum
because the tooling doesn't actively hate the developer[^1].

But language is inherently a decision that is made at the start of a project. It
is much harder to migrate an existing project in C or C++ to a safer language
over time, than it is to start a new project today in a safe language.

I'm not going to say this is impossible, or that you _can't_ or _shouldn't_
migrate existing programs to safer languages. But it's clear that memory safety
is more important to some projects than others. Let's break that down into three
categories: programs, platforms, and insane bullshit[^2].

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
web browsers, virtual machine monitors (VMMs) hypervisors,

### Insane Bullshit

## Real Life

Unfortunately, the most important code to secure via just about every metric is
the insane bullshit. In web browsers, JITs and the GPU are the most exploited
components and some of the most difficult to secure.

[mmu]: \TODO
[mmio]: \TODO
[alex-coreutils]: \TODO

[^1]: \TODO expand on how Zig or Jai tooling makes your program more likely to be correct
[^2]: Spoiler alert! It's JITs.
