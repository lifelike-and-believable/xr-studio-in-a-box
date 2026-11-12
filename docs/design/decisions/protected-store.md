---
id: decision-protected-store
status: draft
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Decision: the protected store is a separate encrypted database that only person sessions in the web app can reach

## Context

story-contracts-and-payment-protect-sensitive-data defines the protected store:

- Identifiers on Jordan's list are kept only there, and only roles that allow it can open it. An agent can never be granted it.
- Identifiers never reach facts, drafts, chat, the log, notifications or previews. Drafts show a placeholder, filled only in the copy a person sends or exports.
- Pasted text that looks like an identifier is refused, with a plain-words message.
- Each opening of the store, and each fill, is logged without the value.
- The store is backed up and restored separately.
- Nothing financial is stored by any story before it exists.

The business layer builds this story. The Layer 1 record has to leave room for it now, and the cheapest point to do that is the command layer (decision-project-record-model). Jordan handles identifiers that agents must never see.

## Options

| Option | For | Against |
|---|---|---|
| A. A separate Postgres database with its own credentials and backups. Values are encrypted at the application level with a key in a managed key service. It is reached only through a protected module of the web app that accepts person sessions with the right role. | Separate backup and restore come by construction. The runner never holds a route or credential to it. A leak of the main database exposes no identifiers. | A second database to run and pay for. The key service is another dependency. |
| B. The same database, with a separate schema and encryption | One database. | Backup and restore cannot be separated cleanly. One credential mistake exposes both. |
| C. A third-party vault, with the record holding references | Specialist security. | Filling placeholders on export still needs our code to read values. Adds a vendor that holds tax data. |
| D. Store nothing: identifiers stay in Jordan's own tools | Nothing to leak. | The story requires them to be entered into and kept only in the protected store, and filled on export. |

## Decision

Option A.

- **Access:** the module checks for a person principal with a role mapped to the protected data class (decision-identity-and-roles). Agent tokens and show machines are refused, and the refusal is logged.
- **Filter:** the record's command layer checks every write to an agent-readable class against the formats on Jordan's list, including chat messages before the runner sees them and the text of agent-readable documents when their upload is registered. A person can confirm a false match, and the confirmation is logged. Layer 1 builds the filter with a starter list of common formats (bank account, transit and institution numbers, SIN, business and GST/HST numbers, payment card numbers) that Jordan can edit, so it works before the business layer's list exists.
- **Fill on export:** the copy is produced in the person's session and handed to them. The record keeps the placeholder version only. Where a sent copy must itself be kept as a business record, that copy is stored in the protected store `[assumed]`.
- **Region:** a Canadian region if the provider offers one (approver's decision, 2026-11-12). Availability is checked before slice 0 `[assumed]`; if no Canadian region is offered, the approver is asked again before the store holds real data.
- **Where values are decrypted:** the protected module runs as a server function of the web app, and the key service holds the encryption key. Values are decrypted in the function's region, not only where the database sits. So the module's functions and the key service are placed in the same Canadian region as the database, if Vercel and the key service offer one. Whether Vercel offers a Canadian function region is not yet checked `[open]`: if it does not, the approver decides before real data is stored whether decryption outside Canada is acceptable or the module runs elsewhere.

## Consequences

- Hard to reverse: keeping identifiers out of the main database. Moving them in later would put every main backup in scope.
- The identifier filter belongs to Layer 1's command layer and is built in slice 2, so it exists before any agent can read facts or chat.
- Revisit if a connected accounting or payroll tool (REQ-business-13) becomes the system of record for identifiers. The store would then hold references only.
