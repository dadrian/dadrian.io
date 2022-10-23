---
title: "Denormalized Schema Design with X.509"
date: 2022-10-22T12:01:00-07:00
uses: ["code"]
---

Designing schemas for large-scale data analysis for [OLAP][olap] (e.g. BigQuery,
Snowflake, Avro, JSON Lines, etc.) is different from designing data structures
in code or schemas for relational databases.

This post focuses on advice for creating schemas for large-scale data analysis.
I use [X.509 certificates][certs] as concrete example of a dataset in need of a
schema because I've worked with it a lot in the last 10 years or so. When
describing schemas, I represent types in [protobuf] format, since it's a
universal type language. I include field numbers to make the syntax valid, but
their individual values are not important. Fields marked as `repeated`
correspond to arrays/lists.

### X.509 Background

X.509 certificates are used for a variety of purposes, but are primarily known
for their use in HTTPS. The certificates are an [ASN.1][asn1] structure
standardized across many different documents, including [RFC 5280][rfc5280]. I
aim to provide enough background in each section to follow along without knowing
anything about the technical details of X.509 going in, but it may be helpful to
understand a few of the high-level components:
* Certificates have a _subject_ and an _issuer_.
* Certificates contain a _public key_ signed by the _issuer_.
* Certificates can contain an arbitrary number of _extensions_.

All publicly trusted certificates are logged to [certificate transparency][ct]
logs. The set of all certificates is useful to researchers, threat hunters, and
root programs. However, the logs are not in a searachable format. It's common
for these users to ingest certificates from logs and store them in a queryable
format for analysis (or to [buy access][censys-enterprise] to it).

### Denormalization

Unlike relational databases, storing data for data analysis in an OLAP should be
_denormalized_. Relational databases prefer _normalized_ data, meaning any
individual piece of data should only be stored once, and tables use IDs to refer
to other objects. For example, instead of a single table of certificates, a
relational database might have a table for subjects, a table for issuers, a
table for keys, and a table for certificates, where the certificates table
references objects from the other tables by ID.

A normalized structure makes it easy to fetch or update an individual record, or
a piece of a record, since all records are individually keyed and data only
needs to be updated in one spot.  However, this makes it difficult write
analytic queries, since any operation will likely require a large number of
joins to select all the data and denormalize it.

Until you start to reach record size limits (~2MB in BigQuery), you're better
off storing all the context to interpret a record in a single denormalized
object. For X.509, this means having a single certificates table, where some
information, like subject and issuer, will be "duplicated" across records.
Modern OLAP databases can still optimize this storage by storing data in
[columnar] format.

### Avoid nested arrays and arrays of structs

TODO

### Convert flags to repeated enums

If you need to represent a set of flags or a bitfield, define each flag as an
enum, and then store the set flags as a list of enums. Do not store the flags as
a structure of bools. Don't do this:

```protobuf
// KeyUsage structured as a series of independent bools.
message KeyUsages {
    bool server_auth = 0;
    bool client_auth = 1;
    bool key_signing = 2;
    bool code_signing = 3;
}

message Certificate {
    // ...
    KeyUsages key_usages = 10;
    // ...
}
```

This structure makes it easy to answer questions about individual values like
"Which certificates have the `ServerAuth` and `ClientAuth` flag?"

```sql
-- How many set SERVER_AUTH and CLIENT_AUTH?
SELECT COUNT(*) FROM certificates
WHERE key_usages.server_auth = TRUE
    AND key_usages.client_auth = TRUE;
```
Unfortunately, it makes it hard to answer questions about the overall makeup of
`KeyUsages`, such as "Which certificates have no key usage flags set?" or "Of
certificates that set ServerAuth, how many don't assert any other key usage?".
This is because questions about the full set of flags require writing a series
of `OR` statements across all fields in `KeyUsage`. This is annoying to do, and
easy to get out of date---every past query will be wrong when a new value is
added.

```sql
-- How many set SERVER_AUTH and no other usages?
SELECT COUNT(*) FROM certificates
WHERE key_usages.server_auth = TRUE
    AND key_usages.client_auth = FALSE
    AND key_usages.key_signing = FALSE
    AND key_usages.code_signing = FALSE

-- Among those that set SERVER_AUTH, how many usages do they have?
--
-- Not even going to write this out, because it would involve counting every
-- combination boolean fields. You can't write this in practice without code
-- generation or reflection once the number of fields get high.
```

Instead, store the flags as a _repeated enum_.

```protobuf
// KeyUsage flags as an enum
enum KeyUsage {
    SERVER_AUTH = 0;
    CLIENT_AUTH = 2;
    KEY_SIGNING = 3;
    CODE_SIGNING = 4;
}

message Certificate {
    // ...
    repeated KeyUsage KeyUsages = 10;
    // ...
}
```

This way, it's still easy to query about individual flags. Instead of using
boolean equals, query for individual using the `IN` operator. However, queries
about the general makeup of flags can leverage the array length to do breakdowns
by how many flags are set, without needing to specify each individual flag
values. The harder queries from the previous structure become easier:

```sql
-- How many set SERVER_AUTH and CLIENT_AUTH?
SELECT COUNT(*) FROM Certificates
WHERE 'SERVER_AUTH' IN KeyUsage AND 'CLIENT_AUTH' in KeyUsage

-- How many set SERVER_AUTH and no other usages?
SELECT COUNT(*) FROM Certificates
WHERE 'SERVER_AUTH' IN KeyUsage AND LEN(KeyUsage) = 0;

-- Among those that set SERVER_AUTH, how many usages do they have?
SELECT COUNT(*), LEN(KeyUsage) FROM Certificates
WHERE 'SERVER_AUTH' IN KeyUsage
GROUP BY 2;
```

### Aggregating over known and unknown values

When parsing data into a fixed schema for analysis, parsers might only be able
to "break out" specific fields that the parser has prior knowledge of, and then
provide the "unknown" fields are a set of key-value pairs, where the keys are
string IDs, and the values are unparsed bytes. In X.509, this happens with
_extensions_.  Extensions are keyed by Object ID (OID), and consist of ASN.1
bytes. If the implementation is unfamiliar with specific extension OID, it can
skip over the value and move on to the next extension.

First, let's consider just the unknown extensions. These could be represented as a map:

{{<highlight protobuf>}}
message Extensions {
    map<string, bytes>
}
{{</highlight>}}


{{<highlight protobuf>}}
message Extensions {
    // Parsed
    AlternativeName subject_alt_name = 0;
    AlternativeName issuer_alt_name = 1;
    KeyID akid = 2;
    KeyID skid = 3;

    repeated UnknownExtensions unknown_extensions = 255;
}

message UnknownExtension {
    string ID = 0;
    bytes value = 1;
}

message KeyID {
    // ...
}
message AlternativeName {
    // ...
}
{{</highlight>}}

This is more text.

> This is a quote

This is a:
* bulleted
* list

[certs]: https://en.wikipedia.org/wiki/X.509
[asn1]: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/
[rfc5280]: https://datatracker.ietf.org/doc/html/rfc5280
[olap]: https://www.snowflake.com/guides/olap-vs-oltp
[columnar]: https://en.wikipedia.org/wiki/Column-oriented_DBMS
[censys-enterprise]: https://censys.io/data-and-search/
