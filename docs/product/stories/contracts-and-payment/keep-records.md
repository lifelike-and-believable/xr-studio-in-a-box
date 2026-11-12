---
id: story-contracts-and-payment-keep-records
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Keep records for as long as each rule requires

As Jordan, the producer, I want each business record kept for as long as every rule that applies to it requires, showing why and until when, so that I keep the records each funder, tax rule and contract requires.

## Acceptance criteria

- A business record is a contract, a quote or invoice, prepared payroll figures and payment records, proof of spend, a funding application, report or claim, a funding decision (story-funding-record-decision), an approval or sign-off, a consent record or an incident record (story-guest-care-record-an-incident) (REQ-business-17). This story defines a business record and its retention. Other stories refer to them by this story's id.
- A retention rule names its source (a funder, a tax rule, a contract or a jurisdiction), the records it covers and its period. The holder of the contracts and licence terms approval (story-project-record-name-approvers) records it, with the date it was checked against the source. An agent can draft a rule from a source document but cannot record or change it. Rules that need legal or tax review are marked pending. This is not legal or tax advice.
- Each record shows every rule that applies to it and is kept until the longest of them ends, including after the project ends. It shows why it is kept and until when. A record with no recorded rule, or with any applicable period unknown, shows "period pending", is never listed as due, and nothing in it is deleted until that holder records the rule.
- Nothing is deleted automatically. When a record's period ends, it is listed as due, and only the holder of the contracts and licence terms approval deletes it. The deletion is logged with who, when and the rule, without the record's content, and a restore of an earlier backup (story-project-record-back-up-and-restore) does not bring it back. An agent cannot delete a record.
- Guest data is not a business record. It stays under REQ-governance-7 and is deleted when the session ends unless the guest opts in (story-guest-care-guest-data). The consent record itself is a business record.
- The story is tested with sample records under two rules of different lengths, one with an unknown period and one with no recorded rule: each shows the longer period, the unknown one and the one with no rule show "period pending" and are never listed as due, and an agent is checked to be refused when it tries to delete a record or record a rule.
