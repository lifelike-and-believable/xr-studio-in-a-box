---
id: decision-identifier-format-list
status: approved
derived-from:
  - story-contracts-and-payment-protect-sensitive-data#acceptance-criteria: 2b9128383b81
  - story-project-record-set-up-organisation#acceptance-criteria: eb7a4e1f7ca0
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Decision: the identifier format list belongs to the organisation, written as simple patterns

## Context

The identifier filter (story-contracts-and-payment-protect-sensitive-data) checks text against "a list Jordan keeps". Facts, documents and, from slice 7, chat all use it, in every project. Where the list lives, who changes it and how a format is written affect every screen that saves text. Jordan is not technical, and the list must work from the first day.

## Options

| Option | For | Against |
|---|---|---|
| A. One list per organisation, changed by the people who look after it, starting from a starter list | Matches who Jordan is: the company's producer. Every project in the company is protected the same way. A new project needs no setup. | A project in another organisation has its own list, even with the same people. |
| B. One list per project | Fine-grained. | Every new project starts again; easy to miss one. Jordan would keep several lists. |
| C. One list for the whole installation | Simplest. | No organisation can add its own formats without affecting others. |
| Format written as a regular expression | Precise. | Jordan cannot write or read one. |
| Format written as a simple pattern: # for a digit, A for a letter, other characters as typed, with named starter formats for cases a pattern cannot express (payment cards with a check digit) | Readable and testable by Jordan with **Try it with an example**. | Less expressive; unusual formats need a starter format added in code. |

## Decision

Option A with simple patterns (approver's decision, 2026-11-12). The list belongs to the organisation and is changed by the people who look after it (design-organisations-and-projects). It starts with the starter formats from decision-protected-store, which can be turned off but not removed. Added formats are simple patterns with at least 6 # or A, so they cannot match short ordinary numbers. When checking, spaces, hyphens and dots between characters are ignored, so a number typed with or without separators matches the same pattern. Where formats overlap (any 9 digits is a Business Number; 9 digits that pass the SIN check digit are also a Social Insurance Number), a match names every format it meets.

## Consequences

- Every write to an agent-readable field checks the list of the project's organisation; organisation facts use their own organisation's list.
- A starter format that needs more than a pattern (the card and SIN check digits) is written in code and reviewed like other code.
- Ignoring separators means a pattern cannot tell "123-456-789" from "123 456 789"; that is intended, because people type identifiers both ways.
- Revisit if an organisation needs formats per project, or if the business layer's own list of identifiers (story-contracts-and-payment-protect-sensitive-data) needs more than patterns.
