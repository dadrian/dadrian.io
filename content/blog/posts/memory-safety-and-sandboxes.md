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
  Operating systems run arbitrary programs and apps of dubious provence and
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

This raises the question---what is the actual security property we get from
memory-safety anyway? If we take the usual description of memory-safety that all
pointers are guaranteed to only point at live objects of the same type (size)
that they were pointing to when the memory was allocated, without any new
allocations in between, what do we actually gain from this?

The best description of this property comes from [Thomas Dullien][halvar] in his
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
but empirical evidence suggests they do not constraint the state space enough to
be as as effective as memory safety.

The main way in which we achieve strong memory safety (and performance) is
compile-time checks of properties that we believe (or have proved!) are
equivalent to memory-safety. The Rust borrow checker enforces that there is only
one mutable reference to any object at a time, and no references are dangling,
and that a reference of one type cannot be switched to a reference of another
type. In practice, this results in a memory-safe program (subject to the use of
`unsafe`[^6]). \TODO check if this is proved

You can also have the compiler shift some responsibility to runtime. For
example, you could instrument every load and store, and enforce pointer
provenance in something that looks like a garbage collector, so long as you
also prevent the compiler from letting you alias[^7].

So if we have mechanisms that rely on the compiler to generate code that is safe
or otherwise enforce safety at runtime, assuming we adopted those solutions (big
if), can we still find ourselves in a situation where code could become a weird
machine?

The failing point in all of this is---what if there are _bugs in the compiler_
(the call is coming from inside the house!). Compilers, being programs as well,
can have bugs. For the most part, compiler bugs are rare when you interact with
a trusted codebase. Occasionally, you may encounter missed optimizations, or
more likely, incorrect optimizations downstream of undefined behavior[^8]. A
sufficiently large codebase such as Chrome or Windows will likely encounter
compiler bugs whenever they roll to a new major compiler version. But that's not
most problems, and those bugs tend to get detected and fixed, as they likely
manifest in failing functional tests.

But what happens if the code being compiled is untrusted, but the compiler is at
least semi-trusted? This is a slightly different threat model from sandboxing a
binary (e.g. a hosting provider that executes your compiled binary for you[^9]),
where we already assume some machine code is malicious, since an attacker could
provide it directly.

In this case, an attacker has a large number of attempts to provide and run code
that could trigger a logic bug in the compiler that would then cause the
compiled output to be exploited into entering a weird machine. But in what
situation would we ever have a semi-trusted compiler but untrusted source code?

Enter Just-In-Time compilers (JITs). These are compilers that write out machine
code _into the current process_. While originally, JITs were often used in the
context of a runtime for your own code (e.g. the JVM, or PyPy), JITs have grown
to be used web browsers and serverless worker (function-as-a-service) platforms.

Similarly, often time the way in which GPU drivers load and run shaders today is
effectively a JIT. The userspace program provides source or
[platform-independent IR][spirv] to the driver, which compiles it into whatever
hardware-specific representation is required by the physical GPU, and then hands
it to the kernelspace driver to execute it on the hardware. This happens at
runtime, meaning the driver is effectively JITing code. This is why many
userspace GPU drivers include a full copy (or fork) of LLVM in their source
code.

In these situations, the JIT needs to be at least semi-trusted for the security
model to work out:
- Many worker platforms can't afford the performance penalty of spinning up a
  new process for every request, so instead they use a [JIT configured to
  isolate][cf-isolates] each individual workload (source input).
- Web browsers [isolate the renderer for individual sites][site-isolation].
  However, given the surface area of the renderer/browser process split, code
  execution in the renderer is still a high severity vulnerability. Individual
  sites have the ability to write and execute arbitrary (malicious) Javascript
  that is then JITed by the Javascript runtime. In this case, the JIT is
  expected to generate code that compiles with the security model of of the
  renderer, rather than arbitrary attacker-controlled machine code.
- In the GPU case, the drivers assume the userspace code is trusted. In the case
  of a game, this makes sense, since the shaders are shipped (or generated)
  directly as part of the game. An individual gamer wishing to force the driver
  into a weird machine by altering the shader code, could instead run the
  malicious code directly on their own computer.

The failure case for the JIT in these situations is that a logic bug results in
machine code that can be leveraged to create a weird machine. It's rare that a
JIT will output fully invalid or directly attacker-controlled machine code, but
instead it will have a logic bug that can be triggered in such a way that we
move from the expected finite state machine and into a weird machine.

What makes this difficult to defend against is the fact that this can and does
happen _even if the JIT is implemented in a memory-safe language_. [V8][v8] is
not the only JIT with bugs, even [wasmtime][wasmtime] / [cranelift][cranelift],
which are implemented in Rust, have logic bugs that can result in weird
machines.

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

The only way that we have to secure against weird machines is to alter the
architecture so that weird machines exist outside of the threat model. For
compile-ahead code, we do this with safety built into the tooling. For some use
cases, we can do this by writing minimally sized, safe VMMs. For other use
cases, like the worker platforms and web browsers, we have to try other
solutions, ranging from "just write less bugs" to "in-process, software-enforced
sandboxes". While prioritizing correctness can help a lot, it's unlikely to get
you to zero bugs. This brings us to in-process sandboxes.

## In-process Sandboxes

What is an in-process sandbox, anyway? Basically, you want to restric some
memory region containing executable code to only be able to access data in some
other memory region, and tightly control any inputs and outputs from that
region. This looks very similar to the [WebAssembly security model][wasm-sec].

One attempt to do this is via the [V8 sandbox][v8-sandbox], which is a
rearchiteture of V8 to never directly generate a raw load instruction. Instead,
all generated (JITed) code uses indicies that are loaded relative to a base
address stored in a specific register that is never loaded into memory, a
variant of pointer swizzling. The V8 runtime then needs to enforce that any
communication between the untrusted sandboxed region and trusted V8 runtime code
is santized, and that there are no edges (function calls via pointer) that are
functionally equivalent to arbitrary read or write.

If you assume bugs in V8 don't cause V8 to generate arbitrary
attacker-controlled assembly, but instead bugs in V8 still generate valid
assembly, but assembly that makes incorrect assumptions about the underlying
data its operating on, then the pointer swizzling approach is effectively a data
sandbox. The memory region controlled by the JIT can stomp around itself all it
wants, but the access are limited to defined range, limiting the weird machine
to a constrained machine that's computationally equivalent to anything you could
already write in Javascript.

This looks very similar to the [WebAssembly memory model][wasm-security] on
paper[^10]---all loads are limited to a bounded range, so worst case you stomp
around your own data, but you probably had that capability anyway, since you
control source.

The problem with these in-process sandboxes is that _their implementations can
still have bugs_. The V8 sandbox, while a huge improvement in security, is (as
of 2025), still not hardened enough to be considered a security boundary that
would enable type confusion in V8 to be considered highly-mitigated and
therefore only a medium severity bug in Chrome, rather than high severity. It
also required touching nearly the entirety of V8, as all interactions need to be
routed through new APIs that respect the security model. In a legacy C++
codebase, this is hard (or impossible?) to enforce at compile-time.

Even if V8 were in Rust, like Wasmtime, it would still be difficult to ensure
the sandbox is bug-free, in the same way it's difficult to ensure the compiler
itself is bug-free. This isn't a reason to not _try_ to implement more security
in JITs, particularly given the extremely low overhead of the sandbox (one add
per load). But what can we do about this?

### What are you gonna do, trap my syscalls?

Barring simply not JITing code, if we assume there can still be bugs in the JIT,
we need hardware support to enforce the memory model that the in-process
sandboxes are building. The way this works is the trusted runtime would
designate regions of memory as sandboxed, and explicitly jump to those regions.
Within the region, whenever the code attempts to access or jump to a
non-sandboxed memory region, either directly (via a jmp, load, or store), or
indirectly via a syscall, the hardware would trap and return control back to a
handler in the trusted runtime, which would be responsible for validating the
access.

Fundamentally, this looks very similar to what MMUs do for the kernel/userspace
boundary, but instead of trapping on a page fault and returning control to the
kernel from userspace, the memory regions are more fine-grained and control
returns to different userspace code.

This doesn't mean that you magically get safe JITs---leveraging such a sandbox
effectively works best when paired with an architecture that looks like the V8
sandbox. However, hardware support is required to catch the errors at runtime
when there's a bug implementing the memory model for the sandbox.

This approach risks bugs in the userland handler for managing communication[^11]
between the JITed code and the runtime, however that code can be much smaller,
written in a type-safe language, and potentially formally verified far easier
than an entire JIT.

### If I were hardware, I would simply isolate faults

\TODO: write about if any of this stuff exists

## What about control-flow mitigations?

\TODO: say something about CFI and CET. Might want to do this earlier?

[mmu]: https://en.wikipedia.org/wiki/Memory_management_unit
[mmio]: https://en.wikipedia.org/wiki/Memory-mapped_I/O_and_port-mapped_I/O
[alex-coreutils]: https://alexgaynor.net/2025/mar/22/coreutils-in-rust/
[v8]: https://v8.dev
[v8-sandbox]: https://v8.dev/blog/sandbox
[reasons]: https://alexgaynor.net/2025/mar/06/things-have-reasons/
[avery-gift]: https://apenwarr.ca/log/20211229
[dadrian-isolate-tweet]: https://x.com/davidcadrian/status/1834645627147329688
[ian-beer-bugs]: https://docs.google.com/presentation/d/16LZ6T-tcjgp3T8_N3m0pa5kNA1DwIsuMcQYDhpMU7uU/edit?slide=id.g3e7cac054a_0_89#slide=id.g3e7cac054a_0_89
[flake-memory-safety]: https://docs.google.com/presentation/d/1-CgBbVuFE1pJnB84wfeq_RadXQs13dCvHTFFVLPYTeg/edit?slide=id.p#slide=id.p
[wxorx]: https://en.wikipedia.org/wiki/W%5EX
[cfi]: https://en.wikipedia.org/wiki/Control-flow_integrity
[halvar]: https://addxorrol.blogspot.com/
[starscan]: https://security.googleblog.com/2022/09/use-after-freedom-miracleptr.html
[spirv]: https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html
[cf-isolates]: https://developers.cloudflare.com/workers/reference/security-model/
[site-isolation]: https://www.chromium.org/Home/chromium-security/site-isolation/
[cranelift]: https://cranelift.dev/
[wasmtime]: https://github.com/bytecodealliance/wasmtime
[wasm-sec]: https://webassembly.org/docs/security/
[wasm-security]: https://webassembly.org/docs/security/

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
[^7]: You can probably drop the alisasing requirement if you do something like
  [*Scan][starscan], but like, at some point you're just writing a deeply
  inefficient garbage collector. If it can be bolted on to legacy codebases,
  this might be useful, but it's likely the reason we're still using that
  "legacy" codebase is because it's fast.
[^8]: Arguably not a bug in the compiler, but an issue with the language design,
  depending on if the undefined behavior is detectable at the point in which the
  compiler applies the optimization or not. However, that's not really relevant
  to what I'm talking about here, where I'm primarily concerned with actual
  logic bugs in the compiler itself, even when the input code is well-formed.
[^9]: The hosting provider might also compile the code for you, but they'll
  likely compile it in the same sandbox they'll execute it in, so there's really
  no security boundary difference between the compiler and the binary. In other
  words, it doesn't matter if the attacker can trigger a bug in the compiler if
  they could also just run arbitrary machine code out of the box.
[^10]: In practice, every WebAssembly implementation worth its salt is a JIT
  with the exact same problems I've been describing in this post.
[^11]: It's turtles all the way down.
