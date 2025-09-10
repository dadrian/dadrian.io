---
title: "Revocation ain't no thang."
date: 2025-09-02T18:13:00-04:00
---

It is well-known that revocation for HTTPS doesn't work. Adam Langley [wrote
about it][agl-revocation] over 10 years ago. Since then, the Web PKI has
drastically changed for the better, despite not "solving" revocation.
Unfortunately, many people interpret Adam's post to mean "we must build a better
revocation system for the Web PKI, today", when in fact, the reality is that
_revocation does not make sense to solve_, and people should stop trying to
solve it directly, because **the actual solution to revocation in the public Web
PKI is short-lived certificates**.

[agl-revocation]: https://www.imperialviolet.org/2011/03/18/revocation.html
