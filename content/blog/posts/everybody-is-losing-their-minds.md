---
title: "Everybody is losing their minds about cryptography because of AI"
date: 2026-10-15T17:25:00-04:00
images:
- img/mind-blown.jpg
---

Last night, we recorded an episode of “Security, Cryptography, Whatever”
discussing the recent AI-driven advances in mathematics, and the discourse
around AI potentially breaking cryptography. I wanted to pre-empt the release of
the episode with a few thoughts. These are more or less the same opinions I
express in the podcast, but condensed down to written form. It should go without
saying that I am not a cryptographer specializing in algebraic cryptanalysis.
This post is based on my discussions with a number of cryptographers and
computer science theorists, as well as my time working in adjacent spaces in
cryptography.

### TLDR

I would expect:

* A few bits of improvement on RSA cryptanalysis due to code optimization, leading to feasible RSA-1024. Arguably, this has already happened via the [AI ports of CADO-NFS to run on giant GPU clusters][https://saweis.net/posts/rsa-896.html].
* This will extend to finite-field Diffie-Hellman, but no one will bother to look or care.
* Elliptic-curve cryptography stays strong to everything except a CQRC
* Lattice-cryptography overall stays strong. Currently standardized schemes like ML-KEM remain strong and at worst lose a couple bits of security.
* Symmetric cryptography stays strong, and AES, specifically, stays strong.

I would suggest that:

* If you are making predictions in this space, you should stick to long-form content, and you should base them on empirical results of what AI is good at, what has already happened, what you already know about the state of cryptanalysis, and have a specific reason you think things will change.
* [Nadia Heninger](https://en.wikipedia.org/wiki/Nadia_Heninger) should be given a bunch of tokens and access to unguardrailed models to do more RSA cryptanalysis.

## AI turns math into a search problem.

Largely, the models are good at two types of searches that yield mathematical results. This is not to downplay the achievements of computing that are the models, or to discard them as stochastic parrots that happened to randomly predict a sentence that disproves the Jacobian conjecture or finds a counter-example to the external force Navier-Stokes equations. However, this does not mean that they are mathematical savants that can find *any* result out of thin air. I would characterize the searches as:

1. **Optimizing some existing thing to a well-specified goal.** This is loosely
  how the Navier-Stokes counterexample was found. The analogy here to computing
  is speeding up an implementation of a codec using a profiler against a
  benchmark.  Tedious, complicated, but verifiable and grindable work. More of a
  depth-first search than a breadth-first search.
2. **Combining two unexpected things.** This is more like how OpenAI models
  proved the hardness reduction from 3SAT to approximate CVP for the lattice
  problems by going through a code-based construction. No one had thought to
  connect lattices to codes in this way, and it was relatively unlikely that a
  single person would have enough expertise in both to do so.

The results in the original [ten advances in
mathematics](https://openai.com/index/ten-advances-in-mathematics/) from August
and the later giant math dump in October were also largely in line with things
that were already expected, but not yet proven, or that if proven, do not upend
our understanding. It may be surprising that *any* of these things were actually
proven, in the sense that a proof was found, but the results themselves were not
necessarily the most surprising. The scale and speed of the results present a
lot of existential questions for mathematicians, which I empathize with. But the
arrow of math continues in the same direction we have expected.

So when it comes to cryptography, is there a reason to expect that improvements in cryptanalysis are amenable to being found as a search problem, and if so, where and how, and why? And should we expect them to upend our current understanding, or further reaffirm it?

## A popular science overview of public-key cryptography

Public-key cryptography enables keys to be split into a public and private key. Alice shares her public key with Bob, and then Bob uses Alice’s public key to establish a shared secret key with Alice. This shared secret can only be calculated by Alice using her corresponding private key, even if all of the messages Bob sends to Alice are public. Public-key cryptography can usually also be extended to encryption of small messages, and to digital signatures. For public key cryptography to work, you need a problem that is easy to compute in one direction, but extremely difficult to compute in the other direction. In other words, from an information-theoretic standpoint, the private key can be calculated from the public key. But in practice, calculating the private key from the public key needs to be so computationally difficult that you won’t finish before the sun burns out.

For any form of public-key cryptography, the security of it is defined by how
good we are at computing the private key from the public key. A scheme is
considered broken if it turns out the underlying math problem is not actually
computationally hard to solve, and you can compute the private key from the
public key using something closer to a MacBook or an AI-lab GPU cluster, as
opposed to requiring a hypothetical supercomputing system powered by a Dyson
sphere wrapping the sun. We loosely measure the strength of public-key
cryptosystems using “bits of security”, which is effectively plugging a key size
into the formula for the computational complexity of the best known algorithm
for computing the private key from the public key, and comparing it to how much
work it would be to brute-force guess a secret key of some length, paired with
extrapolating from real-world computation times at smaller key sizes. If
something has 128 bits of security, it’s roughly equivalent to guessing a
128-bit number.

Let’s separate public-key cryptography into two groups based on the computationally hard problem underpinning the schemes: lattice-based cryptography, which forms the basis for nearly all [post-quantum cryptography](https://dadrian.io/blog/posts/pqc-signatures-2024/), and pre-quantum cryptography based on algebraic groups, which includes elliptic curve cryptography based on the discrete log problem over elliptic curves (ECDLP); finite-field cryptography, the “regular” form of Diffie-Hellman, based on the discrete log problem over the integers modulo a prime number (FFDLP); and RSA, based on factoring.

There’s somewhat of a hierarchy from elliptic curves, to finite fields, to factoring. Sophie Schmieg, the head cryptographer for Google, does an excellent job explaining the math behind [why regular finite-field Diffie-Hellman is actually just a degenerate case of elliptic curve Diffie-Hellman](https://keymaterial.net/2025/05/23/there-is-no-diffie-hellman-but-elliptic-curve-diffie-hellman/). In many ways, RSA is a degenerate case of Diffie-Hellman. You can also see this in the current best algorithms for computing discrete logs in finite fields, and for factoring. They’re similarly structured algorithms, variants of the [number-field sieve](https://en.wikipedia.org/wiki/General_number_field_sieve), which is a type of “index calculus” that performs linear algebra over a giant system of equations over the exponents of numbers in the field. Elliptic curves, on the other hand, fundamentally break this structure, and so no form of index calculus works. Instead, you’re stuck with the even slower [Pollard-Rho algorithm](https://en.wikipedia.org/wiki/Pollard%27s_rho_algorithm). This is why elliptic curves have smaller key sizes to achieve the same security level as RSA or finite-field Diffie-Hellman: the algorithms are less efficient and so we don’t need to make the keys as big to make the computation equally hard.

There exists some extremely impractical public key cryptosystems based on hashes. We’ll ignore them because they’re currently far too big and slow to be used, but nobody, not even the biggest doomers, thinks hash-based schemes will be broken. But it’s nice to at least have an ace in the hole, even if it’s extremely heavy.

## What does this mean for AI?

When it comes to fundamental advancements, you should expect them to broadly be
in the pre-quantum cryptography based on algebraic groups, and *not* in
lattice-based cryptography. This is because the fundamental mathematical
underpinnings of computationally hard problems underpinning lattice-based
cryptography are far more grounded in actual mathematical structure than the
cryptography from algebraic groups. We know for a fact that the simplified LWE
problem over lattices is NP-hard (i.e. as hard as any other hard computing
problem), whereas we have no such proof for ECDLP, FFDLP, or factoring. We also
have no such proof in the other direction (proving that factoring is
*not* NP-hard), although people suspect that factoring is not NP-hard. To make
lattice cryptography practical, the specific instantiations used are not based
on exactly the known NP-hard problem, however its still far more of a basis than
we have for pre-quantum cryptography.

Given all this, we can assume that RSA is the most likely scheme to have cryptanalytic improvements that impact security in a way that allows people to actually compute private keys from public keys, followed by finite-field Diffie-Hellman. In fact, if one of those falls, it’s likely that both will fall. However, elliptic-curve cryptography largely stands alone as the most “ideal” form of algebraic group cryptography.

What would improvements in cryptanalysis of RSA look like? It might be advancing the state of the art with a fundamentally new algorithm in a new, faster complexity class, or it might be simply improving the runtime and constants of the current best algorithm. Improvements within the same complexity class can still remove some bits of security off of RSA. Given how close we are to factoring RSA-1024 already, it’s likely we can eke a few more bits out and make it feasible to factor with a non-quantum computer by 2029\.

The other option with RSA is that it somehow advances advances in its runtime
complexity, as from the current complexity, L(⅓), into the “next fastest”
complexity, L(¼). While finding L(¼) algorithm seems like the most
straightforward advancement for AI to make, it would actually represent a
_massive_ leap in progress, on a problem that has gotten a lot of human
attention for a long time (even if the current group of experts is primarily a
few underpaid mathematicians in France).  I think this is **very unlikely to
happen**. Not for any particular fundamental mathematical reason that prevents
such an algorithm from existing, but because there’s no particular mathematical
reason that it _would_ or _should_ exist either, and therefore it doesn’t seem
to be amenable to be found via the type of search problem that AI is good at. If
an L(¼) algorithm with similar constants to the current L(⅓) algorithms to be
discovered, then RSA-3072 would have the same security that RSA-1024 does today,
RSA-1024 could be broken on a home GPU in a day, and RSA-512 could be factored
nearly instantly. I’m not betting that this happens, and certainly not on any
timeframe that would short circuit that natural migration to lattice
cryptography to mitigate the threat of a CQRC.

For what it’s worth, over the course of 36 hours, I spent a week’s quota of the
max tier ChatGPT Pro account on GPT-6 Astra Ultra trying to get it to come up
with a L(¼) algorithm for factoring and use it to factor a 512-bit RSA key.
While it wrote a lot of Lean, and proved a lot of intermediate impossibility
results, it effectively made no progress. To get it to do this, I had to be very
careful with my prompting to avoid oppressive security guardrails, as [Daybreak
Blue](https://openai.com/index/expanding-daybreak-as-the-cyber-defense-window-narrows/)
does not apply to GPT-6 Astra. I consider this another empirical point that
perhaps the AI is not going to magic up a fast factoring algorithm.

It's tempting to compare token spend to human-year salary, and try to figure out
when [how much token spend is needed to surpass the total human work in the
field][https://bitsofwork.com]. It's not clear that this is meaningful. Not only
is it difficult to estimate how much "human work" has gone in, but tokens do not
work as "credits" towards any particular mathematical result, especially if it
turns out that there is no result. The question of "why would AI be good at this
specific problem" is not something solely answered by token spend.

For elliptic curves and lattices, we may also lose a few bits of security,
however this will likely be due to different causes. Losing a few bits of
security on elliptic curves would probably come from some flawed assumption that
slightly weakens the premise, but elliptic curve cryptography is strong enough
that a few bits isn't moving deployed systems anywhere near practical. At worst,
it moves some of the curves with tight bounds to 128-bit security to be slightly
_under_ 128-bit security, which is purely a conventional wisdom threshold.
Lattices, on the other hand, have a much stronger and more understood
mathematical foundation, and so losing a few bits of security would likely be
due to tightening up the baseline. In either case, I don't think we have any
reason to worry nearly as much as RSA (which I'm not really worrying about,
anyway).

## What should we do?

If we want to have more faith in the cryptography used on the Internet today, both before and after the transition to post-quantum cryptography, we should ensure that the leading mathematicians and cryptographers in algebraic cryptanalysis, and in lattice cryptography, have access to unguardrailed models and tokens.

It’s clear that Anthropic has already used Claude to evaluate many of the submissions to the previous and current iterations of the NIST post-quantum cryptography standardization competitions. However, all the labs could probably do more to formalize such a partnership, rather than relying on the spare time and good graces of a few Anthropic security engineers. At minimum, they could ensure that their users who are cryptographers aren’t getting guardrailed. We should do the same thing for RSA, and ensure that leading cryptographers working on factoring and cryptanalysis, and the authors of CADO-NFS have the tokens required to use modern AI models for research.

We could also probably spend some time thinking about if we’re formalizing some of these problems correctly. Ben Recht, a professor of Electrical Engineering at Berkeley, [raises some extremely valid points](https://www.argmin.net/p/faster-fourier-transforms) about the practicality of some of the complexity improvements published by OpenAI for the FFT algorithm and integer multiplication. Specifically, that they don’t translate to actual computers and are effectively due to bad formalizations of the algorithmic analysis. Theoretical computer scientists will be [the first to tell you](https://en.wikipedia.org/wiki/Galactic_algorithm) the shortcomings of complexity analysis and the importance of “hidden” constants in the real world, however [Big-O complexity analysis](https://en.wikipedia.org/wiki/Big_O_notation) remains the basis for the field. Perhaps, as math becomes more of a programmable artifact, we will have to rethink how we formalize runtime and performance analysis for more applied systems. They’ll also tell you that P vs NP is not a particularly useful question to ask, and yet it still remains the most prestigious question in the field. You probably [can’t even name](https://x.com/hausdorff_space/status/2107916908616175701) the second-most prestigious question. I know I can’t\!

All of this to say, I think [Nadia Heninger](https://cseweb.ucsd.edu/~nadiah/)
should be given a lot of tokens and unfettered access to the models to try to do
more RSA cryptanalysis and factor RSA 1024. In the meantime, there’s plenty of
empirical evidence about what’s possible, how these algorithms work, and what we
know about AI capabilities. We can make predictions that are based on reality,
and not based on what we want to be true, or based on the idea of an all-knowing
mathematical machine that we’ll never understand. We’ve learned zero new things
over the last few months that would confirm or disconfirm the idea that public
key cryptography is over. That suggests to me that we should maintain the status
quo. If your status quo was that factoring was never hard in the first place,
even before AI came into the picture, and we just haven't found the algorithm
yet, then you can stick with it.

In the meantime, I find myself quoting Mrs. Granger far too often.

> I mean, you could claim that anything's real if the only basis for believing in it is that nobody's proved it doesn't exist!
