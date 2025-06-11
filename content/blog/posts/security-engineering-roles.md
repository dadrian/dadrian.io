---
title: "Building a security product is not the same thing as security engineering."
date: 2025-06-11T16:38:08-04:00
---

I recently found myself being repeatedly asked for career advice. I'm not very
good at this, as the best I could offer people in terms of what worked for me is
basically "[get overeducated][grad-school-reasons], then make better decisions
10 years ago".

In the context of "cybersecurity", one piece of advice I can give, that's
applicable to careers, leadership, and getting things done, is to understand the
types of security roles and teams that exist, and which kinds of companies have
them.

I'd roughly bucket security roles into three high-level groups:
1. Securing the organization
2. Securing the product
3. Building a security product

### Securing the organization

Most security teams exist to secure an organization from threats. Many types of
organizations have this role, including companies, non-profits, schools, and
government agencies. Security teams responsible for securing an organization are
often not builders, particularly if the organization is fairly old and
well-established. This doesn't mean they aren't talented, smart, capable people,
but if you're looking for a security _engineering_ job, those are harder to find
in jobs that secure organizations, rather than jobs that secure products.

### Securing the product

The goal of some security jobs is to build a secure product. This type of job often
looks more like a typical software engineering role than, say, a threat-hunting
role. You'll often see this role at a company that is offering some type of
platform. This is because the core feature---running someone else's code---is a
security problem and requires some form of security engineering to solve. This
might involve building specific security features, or improving developer
experience to prevent security problems from appearing in the first place (e.g.
[safe coding][safe-coding]). In this context, security features means a feature
that is security-relevant to the usage or execution of the product itself, not
necessarily a feature that is used by an organization for security purposes
(e.g. filtering in a SIEM). That type of feature is software engineering work as
part of building a security product.

### Building a security product

One cool thing about building a security product is that this is not actually a
security role most of the time! Especially for B2B SaaS security products. Most
of the engineers at security companies are building web applications or data
pipelines or integrations. They're not dealing with security problems as their
day-to-day. It certainly helps to have security knowledge at a security product
company, in the same way that having domain-specific knowledge for whatever the
domain is for any company. For example, it's beneficial for someone building tax
software to understand how taxes work. However, much of the work of building a
security product will be the same slog as any other enterprise product, and
there's no reason to expect everyone working on, e.g., a SIEM, to be a security
expert. There will often be security people in a security product somewhere,
often on some combination of the product team, the research team, or a
customer-facing / consulting team, however most of the engineering team will not
be security engineers.

## So what does this mean?

Nothing really matters and everything is fluid, but it's easy to have mismatched
expectations resulting in disaster if you assume one type of security experience
translates directly into another. If you're looking for a specific type of role,
sometimes it can make sense to work backwards from the type of product company
to find the type of security work you'd like to do. For example, if you want to
learn more about things adjacent to cryptography or PKI, it might make sense to
go to an identity provider. If you want to learn more about sandboxing and
virtualization, it can be good to go to a hosting provider. And if you want to
staff a security team, you probably don't want to hire the person who's only
ever built filterable lists in React for a security dashboard.

[safe-coding]: https://research.google/pubs/secure-by-design-at-google/
[grad-school-reasons]: https://dadrian.io/blog/posts/reasons-to-go-to-grad-school/
