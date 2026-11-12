---
id: decision-identity-and-roles
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - epic-provenance-and-policy#outcome: c0bb4a44b0d6
  - persona-producer#goals: d1cc47b03be9
  - persona-director#goals: a92ca172be83
  - persona-collaborator#goals: 72c41c51284f
---

# Decision: fixed roles defined in code, typed principals, and visibility by data class

## Context

The approved stories fix most of the authorisation model:

- Eleven named roles. A person can hold several, and sees in text what each allows. A change takes effect the next time the person acts. An agent cannot add people or change roles (story-project-record-add-person).
- An approver and a delegate for each gate area. Four protected approvals that never go to an AI. One person can hold everything (story-project-record-name-approvers).
- Each person sees only what their role needs, in the dashboard and in chat (story-project-record-same-project-state). Prompts and reference inputs are restricted by role (story-provenance-and-policy-provenance-record).
- Collaborators open one limited page from an email. A decision needs a one-time code sent to the contact recorded with their terms. An alternate has their own contact (story-provenance-and-policy-collaborator-sign-off).

Jordan has to onboard people quickly without technical help. Robin has to reach only their own items.

## Options

Authorisation:

| Option | For | Against |
|---|---|---|
| A. The eleven roles and their permissions are defined in code and versioned. Projects assign roles to people. Area approvers, delegates and protected-approval holders are separate assignments. Every principal has a type. What a person sees is set by data classes. | Matches the stories exactly. Testable as one permission table. The role texts Jordan reads come from the same table. | A new kind of role needs a code change and review. |
| B. A role editor: each project defines its own roles | Flexible. | The stories define fixed roles that other stories refer to by name. Mistakes in custom roles could expose protected data. |
| C. A general policy engine (Cedar, OPA or OpenFGA) | Expressive. Policies can be audited. | Another component and language to learn and run. The rules here fit in one table. |

Authentication:

| Option | For | Against |
|---|---|---|
| A. An auth library inside the web app, with users stored in our Postgres (for example Better Auth 1.7), using email sign-in links and passkeys | No per-user fees. One database. The library is replaceable behind our session check. | We own the security of sign-in and its updates. |
| B. A hosted identity provider (Clerk, WorkOS or Auth0) | Mature MFA, sign-in recovery and security operations. | Monthly cost per active user. People's records live with a third party. Region choices may be limited. |

## Decision

Authorisation A, and authentication A: an auth library inside the app, with email sign-in links and passkeys (approver's decision, 2026-11-12).

- **Principals:** a person, an agent session, a collaborator contact (no account) and a show machine. A person acts through a channel: the dashboard, or Claude Code (below). An agent session always acts for one requesting person. Its permissions are the overlap of that person's permissions, its grant (decision-agent-runtime) and a fixed list of actions agents can never take. It can never have more than the person.
- **Checks on every request:** permissions are read from the record each time, not stored in long-lived tokens, so a role change applies at the person's next action.
- **Data classes:** each field or record has a class (for example general, budget, prompts and references, protected-store reference, incident). Each role is mapped to the classes it can read and write. Chat answers are built from the same API calls with the person's permissions, so chat cannot show more than the dashboard. A chat thread is private to the person who started it unless shared, and a shared message carries the most restrictive class of anything it quotes (decision-agent-runtime).
- **Protected approvals and area approvers** are assignments that only person principals can hold. A database constraint rejects an agent.
- **Limited pages:** the email link carries a signed token scoped to one collaborator and their own items. Before a decision is recorded, a six-digit code is sent to the contact recorded with the terms, and the code expires after a short time `[assumed]`. A link alone shows only the preview of the item being asked about. Robin's own records (terms, agreements, contracts, pay and credits) and any decision need the one-time code, or a device Robin chose to have remembered after entering one.
- **Staff at a venue** sign in offline with the credential in the show package (decision-offline-show-package). A role change reaches a show machine at its next show package refresh, and the pre-show check shows the package's age (approver's decision, 2026-11-12).
- **Claude Code tokens** (decision-agent-runtime) are issued only to people whose roles cannot read the protected-store data class. The token is the person's own principal on the "via Claude Code" channel, not an agent session: it can do what the person can do and no more, and the log names the channel. Permissions are read on every call, so a role change that grants protected-store access refuses the token on its next call (approver's decision, 2026-11-12).

## Consequences

- Hard to reverse: the principal types, the role ids other stories cite, and the data classes. Adding a class later is cheap. Splitting one is not.
- The permission table is the single place to test "an agent cannot..." criteria across all stories.
- Revisit if a production needs a role outside the eleven, or if a funder needs sign-in through their own identity provider.
