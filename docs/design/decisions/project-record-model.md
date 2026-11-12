---
id: decision-project-record-model
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - epic-review-and-status#outcome: adfddef70e61
  - persona-producer#goals: d1cc47b03be9
  - persona-director#goals: a92ca172be83
---

# Decision: one Postgres record with append-only ledgers and versioned working state, written through one command layer

## Context

The Layer 1 stories ask the record for several things at once:

- One set of facts, shown the same on every surface, with who changed each fact and when (story-project-record-record-facts, story-project-record-same-project-state).
- Earlier versions kept, compared and restored, with later versions kept too (story-review-and-status-feedback-and-versions).
- A project restore that never rolls back the policy record, approvals, sign-offs or the activity log. A business record deleted at the end of its retention period never comes back (story-project-record-back-up-and-restore).
- A log nobody can edit (story-agent-work-read-activity-log), and a board that changes state with no manual update (story-review-and-status-status-board).
- Guest data kept out of backups (REQ-governance-7), and identifiers kept in a protected store (decision-protected-store).
- Records written at a venue with no internet joining the record later (decision-offline-show-package).

Jordan needs records that are never lost. Morgan needs to restore without fear of losing approvals.

## Options

| Option | For | Against |
|---|---|---|
| A. Ordinary tables updated in place, with an audit table written beside them | Familiar, and the least code at first | A restore of earlier state has no clean line between what may roll back and what may not. History of facts has to be added later, table by table. |
| B. Full event sourcing: every state is rebuilt from events | Complete history, and restore is replay | Every read model has to be rebuilt and kept in step. Deleting a record for retention means rewriting history. Heavy for a small team. |
| C. Two kinds of record in one Postgres database. Append-only ledgers: the activity log, approvals and sign-offs, policy terms and their history, provenance entries, the spend ledger, mode switches and the deletion register. Versioned working state: facts, items and their versions, settings, where each change writes a new row version. Every write goes through one command layer. | Restore and version history become one mechanism that only touches working state. The ledgers can be protected at the database level. Records stay in ordinary queryable tables. | Storage grows with every version. Every writer, including agents, has to go through the command layer. |
| D. Facts as files in git (YAML), with a database only for the queue | Diffs and history for free | Producers cannot use git. Role-based visibility of single facts does not fit files. Concurrent edits from the dashboard and chat conflict. |

## Decision

Option C. It is the smallest design in which "restore" and "never rolls back" are both true by construction.

- **Command layer.** The record has one write path. Each command checks the principal and its permissions (decision-identity-and-roles). In one transaction, it writes the new working-state version and its activity log entry. Agent-readable fields are scanned for listed identifiers here (decision-protected-store). File bytes go to object storage from a signed upload URL, but a file becomes part of the record only when its upload is registered through a command; for a document an agent can read, the command scans its text first and holds it if it matches.
- **Ledgers.** The application's database role can insert into ledger tables but cannot update or delete them. The one exception is deletion under a retention rule, which removes a record's content and leaves a register entry with no content. That deletion is made by a separate database role used only by the retention job, never by the application role.
- **Restore.** Restoring a project or an item to an earlier point writes new current versions equal to that point, for working state only. Ledgers are untouched. Access control (roles, agent grants, approver and delegate assignments), the spend limit and the no-term choice are also never restored: they keep their current values, so a removed role stays removed and the gate never loosens without its holder deciding. An item whose state came from an approval keeps the state the approvals ledger gives it. The restore is itself a logged command, and later versions stay.
- **Disaster backups** are a separate matter: the database provider's point-in-time recovery, a daily encrypted dump to a second provider, and versioned object storage with a copy in that second provider. Ledger entries are also copied continuously to write-once storage as content hashes and references, not content, so a disaster restore can replay and verify entries made after the backup point while a record deleted under its retention rule still leaves nothing behind there. After any disaster restore, the deletion register is re-applied, so deleted records stay deleted. Dumps at the second provider are kept 90 days, and a restore drill runs each quarter and before each production (approver's decision, 2026-11-12).
- **Assets.** Each asset version is stored once in object storage under its SHA-256 hash. The record holds its metadata, owner, state and provenance.
- **Identifiers** are UUIDv7, so records made offline at a venue merge without clashes.
- **Out of this database:** guest data (its own store in Layer 6, outside project backups) and the protected store.
- **Region and provider.** The studio is in Toronto. The record is AWS Aurora PostgreSQL in ca-central-1 (Montréal), reached through Vercel's AWS integration, with point-in-time recovery; object storage is S3 in ca-central-1, with Object Lock for the write-once ledger copy; the web app's functions run in Vercel's `yul1` (Montréal) region (approver's decision, 2026-11-12, after the region check recorded in docs/engineering/layer1-skeleton.md). Neon and Prisma Postgres were ruled out because they have no Canadian region. To confirm before slice 1 deploys: that Vercel's AWS Marketplace region picker offers Canada (Central) for Aurora PostgreSQL (otherwise an AWS account is connected by hand) `[assumed]`.

## Consequences

- Hard to reverse: the split between ledgers and working state, the id scheme, and content-addressed assets. The table layout behind the command layer is cheap to change.
- Restore is a forward write, so it can be tested on a real project without risk (the story requires a tested restore).
- The ledger copy to write-once storage needs a provider that supports object lock `[assumed]`. The spec checks this.
- **Erasure requests `[open]`.** The activity log cannot be edited (story-agent-work-read-activity-log), so a privacy erasure request from staff or a collaborator, for example on a tour to the UK or EU, can only be met by pseudonymising that person's entries: the person record is replaced by a placeholder and the log keeps the placeholder. This is pending the legal review (story-contracts-and-payment-legal-reviews).
- **Disaster restore and the log `[open]`.** story-project-record-back-up-and-restore says a restore never rolls back the activity log. A project restore meets this by construction. A disaster restore of the database relies on the write-once copy of the ledger to replay entries made after the backup point, which depends on the object-lock check above. Until that is verified, a disaster restore can lose log entries made after the last backup. Slice 5 closes this: it checks object lock at the provider and runs one scripted disaster restore from a dump, with ledger replay and the deletion register re-applied (docs/design/architecture.md).
- Revisit if an engine-side tool writes at a volume this layer cannot take (capture metadata, for example). That data would get its own store and keep only references here.
