---
title: "Denormalized Schema Design with X.509"
date: 2022-10-30T11:54:00-0500
draft: false
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
correspond to arrays or lists, which I use interchangably. Protobuf Message
types are defined by the `message` keyword, and I consider the terms "message",
"type", and "object" to be interchangable.

## X.509 Background

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

## Denormalization

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

## Avoid nested arrays and arrays of objects

In most query languages and programming languages, identifying an individual
element in an array or list is straightforward if one of the following are true:
* You know the index of the element and can access it directly, or
* The element is a primitive value and the `IN` operator exists.

Nested arrays (arrays of arrays)


## Convert flags to repeated enums

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

An object containing many bools makes it easy to answer questions about
individual values like "Which certificates have the `ServerAuth` and
`ClientAuth` flag?"

```sql
-- How many set SERVER_AUTH and CLIENT_AUTH?
SELECT COUNT(*) FROM certificates
WHERE key_usages.server_auth = TRUE
    AND key_usages.client_auth = TRUE
;
```

Unfortunately, this structure also makes it hard to answer questions about the
overall makeup of `KeyUsages`, such as "Which certificates have no key usage
flags set?" or "Of certificates that have the Server Auth flag, how many don't
assert any other key usage?".  This is because questions about the full set of
flags require writing a series of `OR` statements across all fields in
`KeyUsage`.  This is annoying to do, and easy to get out of date---every past
query will be wrong when a new value is added.

```sql
-- How many set SERVER_AUTH and no other usages?
SELECT COUNT(*) FROM certificates
WHERE key_usages.server_auth = TRUE
    AND key_usages.client_auth = FALSE
    AND key_usages.key_signing = FALSE
    AND key_usages.code_signing = FALSE
;
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

This way, it's still easy to query about individual flags. Queries use the `IN`
operator instead of boolean equals. However, queries about the general makeup of
flags can leverage the array length to do breakdowns by how many flags are set,
without needing to specify each individual flag values. The harder queries from
the previous structure become easier:

```sql
-- How many set SERVER_AUTH and CLIENT_AUTH?
SELECT COUNT(*) FROM Certificates
WHERE 'SERVER_AUTH' IN KeyUsage AND 'CLIENT_AUTH' in KeyUsage;
-- How many set SERVER_AUTH and no other usages?
SELECT COUNT(*) FROM Certificates
WHERE 'SERVER_AUTH' IN KeyUsage AND LEN(KeyUsage) = 0;
-- Among those that set SERVER_AUTH, how many usages do they have?
SELECT COUNT(*), LEN(KeyUsage) FROM Certificates
WHERE 'SERVER_AUTH' IN KeyUsage
GROUP BY 2;
```

## Aggregating over known and unknown values

When parsing data into a fixed schema for analysis, parsers might only be able
to "break out" specific fields that the parser has prior knowledge of, and then
provide the "unknown" fields are a set of key-value pairs, where the keys are
string IDs, and the values are unparsed bytes. In X.509, this happens with
_extensions_.  Extensions are keyed by Object ID (OID), and consist of ASN.1
bytes. If the implementation is unfamiliar with specific extension OID, it can
skip over the value and move on to the next extension.

First, let's consider just the unknown extensions. These could be represented as a map:

```protobuf
map<string, bytes> unknown_extensions;
```

However, this won't translate well into most schema descriptions because the
fieldnames (keys of the map) are dynamic[^1].  Instead, flatten the map into an
array.

```protobuf
message Certificate {
    // ...
    Extensions extensions = 20;
    // ...
}

// Extensions contains parsed and unknown extensions.
message Extensions {
    // Parsed
    AlternativeName subject_alt_name = 0;
    AlternativeName issuer_alt_name = 1;
    KeyID akid = 2;
    KeyID skid = 3;

    // Unknown
    repeated UnknownExtensions unknown_extensions = 255;
}

// UnknownExtension is an (OID, bytes) tuple.
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
```

This will hold all extensions, known and unknown, without any information loss
(subject to parsing), and without any dynamic field names. It's now possible to
get a breakdown of unknown extensions, and to access rich, structured data about
the known extensions.

```sql
-- Access individual extensions
SELECT COUNT(*) FROM certificates WHERE extensions.akid = "<value>"
-- Unknown extensions broken down by ID
SELECT COUNT(*), e.ID FROM certificates c
CROSS JOIN UNNEST(c.extensions.unknown_extensions) as e
GROUP BY 2
```

However, we do not have the ability to easily understand the breakdown of _all_
extensions because we don't store the IDs of the _parsed_ extensions. We can fix
this by storing it alongside the unknown extensions, even though the data is
implied by the existance of specific parsed fields. Similar to the flags-to-enum
case, this avoids having to write another massive `OR` across all fields in
`extensions`.

```protobuf
// Extensions contains the IDs of all extensions. Known extensions are parsed.
message Extensions {
    // Parsed
    AlternativeName subject_alt_name = 0;
    AlternativeName issuer_alt_name = 1;
    KeyID akid = 2;
    KeyID skid = 3;

    // IDs
    repeated string IDs = 4;

    // Unknown
    repeated UnknownExtensions unknown_extensions = 255;
}
```

Now we can easily write breakdowns across all extension values!

This structure violates the earlier recommendation of avoiding arrays of
objects, since `unknown_extensions` is a repeated object. This is only required
if we need to store the raw bytes for the unknown extensions, separated out. Do
we really need this?

## Think carefully about if and where you store raw values

Try to avoid storing unparsed values alongside parsed values whenever possible. In an ideal world, there is a separate datastore for raw values that is not your OLAP database. In practice, you might have both. If you do include raw values, be thoughtful about where you put them. Continuing the previous example, let's see what happens when we move the array of raw unknown extensions a single blob for all extensions.

```protobuf
// Extensions contains the IDs of all extensions. Known extensions are parsed.
message Extensions {
    // Parsed
    AlternativeName subject_alt_name = 0;
    AlternativeName issuer_alt_name = 1;
    KeyID akid = 2;
    KeyID skid = 3;

    // IDs
    repeated string IDs = 4;
    repeated string unknown_extensions = 5;

    // Full extension bytes
    bytes raw = 254;
}
```

What happens to our queries? We still have the unnest for aggregates, but we can
query for individual extensions directly. Depending on your needs, this is
likely a better setup.

```sql
-- Access individual extensions
SELECT COUNT(*) FROM certificates WHERE extensions.akid = "<value>"
-- Access individual extensions by ID
SELECT COUNT(*) FROM certificates WHERE "1.2.3.4" IN extensions.ids;
-- Unknown extensions broken down by ID
SELECT COUNT(*), id FROM certificates c
CROSS JOIN UNNEST(c.extensions.unknown_extensions) as id
GROUP BY 2
-- All extensions broken down by ID
SELECT COUNT(*), id FROM certificates c
CROSS JOIN UNNEST(c.extensions.unknown_extensions) as id
GROUP BY 2
```

## Save storage by shipping functions

If you have the ability to ship a set of macros or functions with your OLAP
dataset (e.g. [UDFs][udf] in BigQuery), you can save some storage space by providing
functions that calculate derived fields at runtime. For example, instead of
storing all extension IDs, you could write a function that materializes a list
of IDs based on the contents of the `extensions` object. If you know you're
going to be in a single system, and you have the ability to provide importable
functions for each version of your dataset easily, this might be a good option.

```sql
SELECT COUNT(*), id FROM certificates c
CROSS JOIN UNNEST(ExtensionIDs(c.extensions)) as id
GROUP BY 2
```

In this eample, `ExtensionIDs` is a function that takes an `Extension` object
and returns an array of strings.

If you don't have the ability to easily ship functions bound to specific
versions of your dataset, don't do this.

## Timeseries and current state are probably different

You probably don't want to store full objects in timeseries tables, even in an
OLAP system. This is a reasonable use case to rely on joins, and just store
identifiers in the timeseries table.

[certs]: https://en.wikipedia.org/wiki/X.509
[asn1]: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/
[rfc5280]: https://datatracker.ietf.org/doc/html/rfc5280
[olap]: https://www.snowflake.com/guides/olap-vs-oltp
[columnar]: https://en.wikipedia.org/wiki/Column-oriented_DBMS
[censys-enterprise]: https://censys.io/data-and-search/
[udf]: https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions
[protobuf]: https://developers.google.com/protocol-buffers/docs/proto3
[ct]: https://certificate.transparency.dev/

[^1]: If you're dealing with files and scripts, this might be fine. Python will
  happily parse a map, and stronger-typed languages like Go can fallback to
  string maps. And technically, you could make it a JSON field in something
  like BigQuery. But in all cases, you're pushing at the edge of features,
  compatibility, and consistency as soon as field names become dynamic.
