---
title: "Sandboxes? In my process? It's more likely than you think."
date: 2025-07-06T11:31:00-04:00
uses: ["code"]
images:
  - img/memory-violence-shield-crab.png
---

Discussions around [memory safety][alex-vps] often focus on choice of language,
and how the language can provide memory safety guarantees. Unfortunately,
choosing a language is a decision made at the start of a project.  Migrating an
existing C or C++ project to a safer language is much harder than starting a new
project in a safe language[^1]. I'm not going to say this is impossible, or that
you _can't_ or _shouldn't_ migrate existing programs to safer languages. And
sometimes people [just do things in open-source][fish-rewrite], and that's [part
of the fun of it][avery-gift].

Given that we have a limited amount of total effort, where should we be
looking at rewriting code in memory safe languages, how can we apply rewrites
effectively, and in what cases do we need to go even _beyond_ compile-time
memory safety? And what does this have to do with in-process sandboxes?

## Defining the category

Memory safety is more important to some projects than others. Let's break that
down into three categories: programs, platforms, and insane bullshit[^2].

### Programs

Most programs do not need to be rewritten or migrated to a memory-safe language.
The primary risk from a memory safety bug is that it is vulnerability that can
give an attacker the ability to remotely execute code (RCE). The secondary risk
is that memory-safety vulnerabilities might [leak data to a remote
attacker][heartbleed], even if they don't allow for RCE.

If a program primarily runs on a single computer or a server, does not talk to
_arbitrary_ network or hardware clients, and does not execute untrusted code,
there is limited security benefit to removing memory-safety vulnerabilities.

Programs with constrained attack surfaces that aren’t used in security-relevant
contexts typically don’t have a history of vulnerabilities caused by memory
unsafety, and so making them memory safe will not reduce the number of
vulnerabilities. There may be ecosystem benefits to [migrating tools like
coreutils to Rust][alex-coreutils], but `ls` is not an entry nor a
privilege-escalation (LPE) vector, and so the security argument is pretty weak.

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

The code where memory safety matters most is in platforms, which I'm defining as
anything that manages _capabilities_---the permissions and access for another
program or process to perform operations on some resource. A platform could be
any program that runs other untrusted code, manages an untrusted network, or
communicates with untrusted hardware. Some examples include operating systems,
web browsers, virtual machine monitors (VMMs), hypervisors, and serverless
worker cloud environments[^4]. In these cases, implementations using a memory
safe language for new code can expect to have [significantly fewer
vulnerabilities][android-msl] than implementations that are unsafe by
default[^16].

Breaking this down further, this is basically three types of programs that all
manage some sort of capability:
- **Programs with the specific purpose of running other people's code.**
  Operating systems run arbitrary programs and apps of dubious provence and
  provide them capabilities, such as a clean memory region, and access to the
  filesystem, network, and TPM. Web browsers provide similar capabilities to
  websites, but the sites are implemented in Javascript and WebAssembly and the
  DOM, rather than as native binaries.
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
memory safe language doesn't actually achieve what we normally mean when we say
a program is memory safe.

This raises the question---what is the actual security property we get from
memory safety anyway? If we take the usual description of memory-safety that all
pointers are guaranteed to only point at live objects of the same type (size)
that they were pointing to when the memory was allocated, without any new
allocations in between, what do we actually gain from this?

The best description of this property comes from [Thomas Dullien][halvar] in his
[presentation at DistrictCon][flake-memory-safety]. The basic idea is that a
program is, in theory, intended to be a finite-state machine and do some sort of
computational task, as written by the programmer. During the execution, the
program follows a set of transitions in the state space defined by the
programmer. An attacker's goal is to find some way to transition the state
machine off of its intended path and into a weird state, such that as it follows
the transitions defined by the programmer, it gets into weirder and weirder
states that eventually do something the attacker intends (such as run malicious
code), rather than what the programmer intended.

The set of states most programs can be in is impossibly large, but it is still
considerably smaller than the set of states a computer _could possibly_ be in.
Once an attacker finds a memory-safety bug, they begin the process of walking the
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
type. In practice ([and in theory][rust-thesis]), this results in a memory-safe
program (subject to the use of `unsafe`[^6]).

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
context of a runtime for your own code (e.g. the JVM, or PyPy), JITs are now
commonly used in web browsers and serverless worker (function-as-a-service)
platforms.

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
machine code that can be leveraged to create a weird machine. JITs rarely output
fully invalid or directly attacker-controlled machine code when they have a bug.
Instead, a JIT will have a logic bug that can be triggered in such a way that we
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
you to zero bugs. That brings us to in-process sandboxes.

### In-process sandboxes

What is an in-process sandbox, anyway? Basically, you want to restrict some
memory region containing executable code to only be able to access data in some
other memory region, and tightly control any inputs and outputs from that
region. This looks very similar to the [WebAssembly security model][wasm-sec].

One attempt to do this is via the [V8 sandbox][v8-sandbox], which is a
rearchitecture of V8 to never directly generate a raw load instruction. Instead,
all generated (JITed) code uses indices that are loaded relative to a base
address stored in a specific register that is never loaded into memory, a
variant of pointer swizzling. The V8 runtime then needs to enforce that any
communication between the untrusted sandboxed region and trusted V8 runtime code
is sanitized, and that there are no edges (function calls via pointer) that are
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
paper---all loads are limited to a bounded range[^10]. Worst case you stomp
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
returns to different userspace code. Another way to think about this is [ARM's
"realms"][arm-realms] ([POE][poe]) extended to userland without context
switches, rather than primarily being used for TrustZone / TEEs / TPMs.

This doesn't mean JITs become magically safe---such a sandbox work best when
paired with a code architecture that looks like the software V8 sandbox.
Hardware support for in-process sandboxing enables the software sandbox catch
errors at runtime when there's a bug in the implementation of the memory model
for the JIT generated code.

This approach risks bugs in the userspace handler for managing communication[^11]
between the JITed code and the runtime, however that code can be much smaller,
written in a type-safe language, and potentially formally verified far easier
than an entire JIT.

### If I were hardware, I would simply isolate faults

Narayan et al\. introduced [hardware fault isolation (HFI)][hfi-paper] as a way
to do hardware-assisted in-process isolation on x86 processors. Partnering with
Intel, they were able to add instructions to designate "sandboxed" regions of
both data memory and instruction memory, and trap accesses, effectively
implementing the Wasm memory-model in hardware such that it can be leveraged by
a runtime to perform in-process isolation. Unfortunately, these instructions so
far only exist in Intel's simulator, not on real hardware.

There is a risk that hardware support for in-process sandboxing will somehow
always be 3-5 years away. However, there's clearly demand for this type of
isolation beyond securing web browsers. Any [cloud provider with a workers
platform][cloudflare-workers] is currently in-between a bit of a rock and a hard
place---process-level isolation is too slow to spin up workers without having
the [cold-start problem][lambda-cold-start]. The model of worker
where everything is Javascript or WebAssembly is implemented by [relying on the
abstractions of the underlying JIT runtime][cf-isolates][^13], which means that
isolation does not have any hardware or operating system support, but instead
relies on the runtime code itself to not have bugs. Unfortunately, as discussed
earlier, JITs and JIT runtimes are full of bugs.

Luckily, these worker platforms have not been targets of exploitation (that we
know of!), however if they do become a more attractive target[^14] for
[well-funded attackers][vigilant-labs], that might change. At which point, the
worker platforms are really going to be between a rock and a hard place unless
they can buy hardware that helps secure their runtimes.

### CHERI, can you come out tonight?

Punting addressing memory-safety to hardware is usually a case of wishful
thinking, hoping if we ignore the problem, it will go away or a magical solution
will appear in the future that will be easier to adopt than a memory-safe
language.

Solutions like HFI are not replacements for migrating to memory-safe languages
or implementing user-level software sandboxing abstractions, they are a
supplement to it for the particularly difficult to secure case where code is
compiled at runtime, where any logic bug ends up being equivalent to RCE.

It is not a good idea to assume hardware features such as [MTE][mte] or
[CHERI][cheri] will somehow allow legacy code to suddenly become memory
safe[^12], nor are they particularly applicable to the JIT use case. MTE
requires a lot of physical space on the chip, and provides only probabilistic
defense that isn't suitable for the case where an attacker can retry an exploit
multiple times against the same memory space, such as a web browser renderer
process. CHERI requires source rewriting and effective use of capability domains
to be effective. This is an option for "normal" programs, but correctly using
capability domains between the JIT runtime and JIT-generated code is the same
shape of problem that we already see with the V8 sandbox---simply implementing
it correctly _is hard_. At minimum, `*JSArray`, `*JSString`, and `*JSObject`
would all need to be separate capability domains on both sides of the runtime.

That doesn't mean these technologies are bad, but they're not an effective use
of hardware for the JIT-problem, specifically. And when it comes to "normal"
programs, CHERI is not as effective as using a type-safe memory safe language,
but still requires source-rewriting. And MTE can be bypassed with an information
leak or by trying an exploit multiple times.

## A grand unified strategy

Platforms should be migrating towards memory safety by default for new code.
[Chrome][chrome-rust] and [Windows][windows-rust] are adopting more and more
Rust, and Android is [using memory safe languages for all new
projects][android-msl]. All platforms should be trying to figure out how to make
safe languages the default for new code. This problem is particularly hard for
monolithic codebases---Chromium has over 66 million lines of C++, they're
not all gonna be winners.

Mitigations like CFI and CET are important to raise the bar for exploitation on
existing C and C++ code. The quicker you can enable CFI on a codebase, even if
it's functionally bypassable (e.g. with a JIT), the easier it will be to
maintain and expand over time. It's a marathon, not a sprint.

If you're working in C++, adopting advanced allocator mitigations like
[MiraclePtr][miracle-ptr] can drastically reduce the exploitability of many
common use-after-free vulnerabilities. Safer coding patterns and compiler
extensions like `-fbounds-safety` and `-Wunsafe-buffer-usage` help prevent
invalid iterators and out-of-bounds memory errors (sometimes referred to as
_[spanification][spanification]_).

Software isolation, like the V8 sandbox, is important to make JITs as secure as
possible on as many platforms. Memory safe JIT implementations like also move
the bar forwards, as they reduce the chance of vulnerabilities in the runtime
itself when properly leveraged.

As a society, we have empirically revealed that we cannot write codebases in C++
that are large and secure. In some ways, any sort of software solution to JIT
isolation is just another variant of the same problem---**you can't fully secure
C++ by writing more C++**. However, we still need to put in this effort both because
_something_ is better than nothing, and because properly architecting a JIT in
software is key to effectively leveraging in-process hardware isolation when
it's available.

Moral of the story---we have a well-understood memory safety problem.  The
hardware we need to help us solve the problem is _not_ MTE or some other
ineffective mitigation that we're hoping will let us bury our heads in the sand
instead of finding ways to write new code in memory safe languages. Instead,
hardware can help with _new_ primitives like HFI that let us go _beyond_ the
security guarantees of compile-time memory safety[^12].

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
[mte]: https://developer.arm.com/documentation/108035/0100/Introduction-to-the-Memory-Tagging-Extension
[cheri]: https://en.wikipedia.org/wiki/Capability_Hardware_Enhanced_RISC_Instructions
[hfi-paper]: https://cseweb.ucsd.edu/~tullsen/hfi.pdf
[arm-realms]: https://learn.arm.com/learning-paths/servers-and-cloud-computing/cca-container/overview/
[poe]: https://developer.arm.com/documentation/102376/0200/Permission-indirection-and-permission-overlay-extensions
[cloudflare-workers]: https://developers.cloudflare.com/workers/
[lambda-cold-start]: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html#cold-start-latency
[vigilant-labs]: https://www.vigilantlabs.com/
[fish-rewrite]: https://fishshell.com/blog/rustport/
[heartbleed]: https://www.heartbleed.com/
[android-msl]: https://security.googleblog.com/2024/09/eliminating-memory-safety-vulnerabilities-Android.html
[chrome-rust]: https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/rust.md
[windows-rust]: https://github.com/dwizzzle/Presentations/blob/master/David%20Weston%20-%20Windows%2011%20Security%20by-default%20-%20Bluehat%20IL%202023.pdf
[history-langs]: https://james-iry.blogspot.com/2009/05/brief-incomplete-and-mostly-wrong.html
[miracle-ptr]: https://security.googleblog.com/2022/09/use-after-freedom-miracleptr.html
[wasmtime-bugs]: https://github.com/bytecodealliance/wasmtime/security/advisories
[rust-thesis]: https://research.ralfj.de/thesis.html
[deian]: https://cseweb.ucsd.edu/~dstefan/
[shravan]: https://shravanrn.com/
[alex-vps]: https://alexgaynor.net/2019/aug/12/introduction-to-memory-unsafety-for-vps-of-engineering/

[^1]: When I say safer language, I don't necessarily mean Rust. For programs
  that need to be native, the safer language can be Rust or it could be
  something like Zig or Jai. If you can handle a garbage collector, there's
  plenty of options with performance, such as Go or a JVM-based language. And if
  you don't care about efficiency at all, there's Typescript and Python. Not all
  of these languages are as "safe" as Rust, but _all_ are better than C and C++.
  When the toolchain doesn't hate the developer, it can actually be possible to
  detect more bugs up front. The Zig toolchain basically comes with
  [MiraclePtr][miracle-ptr] built in because o how it handles allocators in the
  language. Jai is limited to just Jonathan Blow and friends, but being able to
  run compile-time metaprograms means you can enforce invariants and inject
  safer patterns to as part of the regular development process, with a fast
  feedback loop that doesn't involve [uploading your C++ to Skynet to get it to
  compile][history-langs].
[^2]: Spoiler alert! The "insane bullshit" is JITs.
[^3]: A high severity bug is loosely defined as a memory safety bug that could
  potentially lead to RCE in the renderer. A stable-impacting bug means that the
  bug is present in a stable release Chrome, meaning any security bug that is
  only ever present in HEAD but is fixed before ever being released is excluded.
  A critical security bug is RCE in a high-privilege (i.e. browser, GPU) process.
[^4]: [It's called an isolate, what do you mean it's not sandboxed?][dadrian-isolate-tweet]
[^5]: If it was trusted, you could just give it direct access and not have a
  capability in the first place.
[^6]: If you think of memory safety as trying to reduce the paths an attacker can
  use to enter a weird machine, than it's clear that the existence of unsafe blocks,
  while they could potentially violate the safety guarantees of the rest of the
  program if the attacker is able to enter a weird machine from the unsafe code,
  is not nearly as risky as unsafe C/C++ code generally, in which an attacker
  can potentially entire a weird machine from _any_ line of code.
[^7]: You can probably drop the aliasing requirement if you do something like
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
[^12]: For the love of god, just give [Shravan Narayan][shravan] and [Deian
  Stefan][deian] money. If you're a processor company, just do whatever they
  tell you.
[^13]: I'm ragging on Cloudflare a little here because they're a notable V8
  user, but it's not just them. Fastly's workers rely on Wasmtime and Cranelift
  not having bugs. Unfortunately, despite the Rust, they still have
  [type-confusion bugs in the JITed code][wasmtime-bugs], even if they don't
  have memory safety bugs in the runtime itself.
[^14]: I'm not saying state-sponsored attackers don't go after platforms, but
  most of the time it's much more economical and less risky to just go own
  someone's phone. For the law enforcement case, there's well-lit legal paths
  (warrants) for to go after an individual phone, whereas exploiting _an entire
  platform_ is clearly much more legally murky.
[^15]: CFI and friends should also be enabled for safe code, but usually that's
  much easier and likely comes out of the box when you're not aliasing all the
  time, jumping to a `void*`, or overwriting your own return address.
[^16]: Some operations, such as managing an [MMU][mmu] or [memory-mapped
  IO][mmio] are fundamentally unsafe, and programs that need to do unsafe
  operations do not benefit as much from memory safe languages. But even in
  these cases, limiting the unsafety to as small of a core as possible, and
  interacting with it from safer wrappers is still an improvement over the base
  case, where literally everything is unsafe. This doesn't necessarily even need
  to be `unsafe` the Rust keyword---it might be a smaller C kernel core for the
  lowest-level code, surrounded by a safe language everywhere else at high
  privilege, with well-defined communication methods between the core and the
  safe code.
