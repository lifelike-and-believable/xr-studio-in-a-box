---
id: spec-layer1-organisations-projects-people
status: draft
derived-from:
  - story-project-record-set-up-organisation#acceptance-criteria: eb7a4e1f7ca0
  - story-project-record-start-project#acceptance-criteria: 83fa11a80149
  - story-project-record-add-person#acceptance-criteria: 8f5b1df665e2
  - decision-identity-and-roles#decision: 402e397cf1b0
  - decision-project-record-model#decision: 0ac75b9a439f
  - design-architecture#build-order: f852bcde272e
# tests-commit: <sha of the commit that holds the failing tests, once written>
# unlocks:
#   - <test path>: <why a locked test had to change>
---

# Layer 1, slice 1: organisations, projects and people

## Problem

Nothing in the record exists yet: no one can sign in, and there is nowhere to put a project. Morgan needs to start a project with a name, a brief and an owner. Jordan needs to put each project in an organisation and give people roles without technical help, and a role change must take effect at the person's next action. Slice 1 builds sign-in, organisations, projects and people with roles, on the skeleton from slice 0, through the record's single write path (design-architecture#build-order, slice 1).

## User stories

- story-project-record-set-up-organisation, without organisation facts (slice 2).
- story-project-record-start-project.
- story-project-record-add-person, without show machines (Layers 4 and 5).

## Acceptance criteria

"Source" names the story section each criterion comes from. A test cites a criterion as `layer1-organisations-projects-people#AC-1` in its title or a comment.

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-1 | `contracts/` exports the eleven role ids (director, producer, technical artist, artist, sound designer, interaction designer, capture crew, show operator, venue attendant, performer, collaborator) and the slice 1 permissions. The web app's permission table gives every role a set of permissions and a plain-words description, and no role holds a permission that is not in the table. No role grants any of the four protected approvals: the table has no approval permissions. | story-project-record-add-person#acceptance-criteria | test: `permission table covers every role` |
| AC-2 | For each of the eleven roles, the permission table answers each slice 1 permission as the table in "Roles and permissions" below states. A person with two roles holds the union of both roles' permissions. | story-project-record-add-person#acceptance-criteria | test: `permission table matches the spec for all eleven roles` |
| AC-3 | A command made by an agent-session principal to create an organisation, move a project between organisations, add a person, or give, change or remove a role is refused, whatever roles the person it acts for holds. | story-project-record-add-person#acceptance-criteria | test: `agents cannot manage organisations or people` |
| AC-4 | A signed-in person can create an organisation from the dashboard by giving its name; they become the person who looks after it, and the organisation shows them as such. No code or configuration file is involved. | story-project-record-set-up-organisation#acceptance-criteria | test: `create an organisation from the dashboard` |
| AC-5 | A signed-in person can create a project from the dashboard by giving a name, a brief and an owner and picking one of the organisations they look after. The project then appears in their project list with its name, brief, owner and organisation, and its page shows which organisation it is in. | story-project-record-start-project#acceptance-criteria | test: `start a project in an organisation` |
| AC-6 | When the person has no organisation to pick, creating a project makes a default organisation named after the project, places the project in it and makes the person the one who looks after it. The person who looks after an organisation can rename it. | story-project-record-start-project#acceptance-criteria | test: `start a project with a default organisation` |
| AC-7 | Submitting the new-project form without a name, without an owner, or without both, creates nothing, and the form says in text which fields are missing, next to each field, with focus moved to the first one. The API returns 400 with the missing fields named. | story-project-record-start-project#acceptance-criteria | test: `missing project fields are named` |
| AC-8 | The project's owner is given the director and producer roles when the project is created, so a solo production works at once. | story-project-record-start-project#acceptance-criteria | test: `owner holds director and producer` |
| AC-9 | A person with the "manage people" permission can add a person to a project by email from the dashboard and choose one or more roles. Before choosing, the form shows each role's plain-words description. The added person receives a sign-in link by email. | story-project-record-add-person#acceptance-criteria | test: `add a person with two roles` |
| AC-10 | The project page lists who is on the project and each person's roles. | story-project-record-add-person#acceptance-criteria | test: `project shows people and roles` |
| AC-11 | An added person who signs in sees the project in their list and can open it, and sees only what their roles allow: a person without "manage people" sees no add, change or remove controls and is refused by the API (403) if they try; a person whose only roles cannot open the dashboard (collaborator, performer, venue attendant) does not see the project in their list and gets 403 on its page and API. | story-project-record-add-person#acceptance-criteria | test: `people see only what their roles allow` |
| AC-12 | A person with "manage people" can change or remove someone's role. The change applies at that person's next request: an API call or page load made after the change is answered with the new permissions, with no sign-out, and a person with no roles left loses the project from their list and gets 403. | story-project-record-add-person#acceptance-criteria | test: `role change applies at the next request` |
| AC-13 | Staff sign in with a link sent to their email address. A signed-in person can register a passkey and sign in with it next time. Links are single-use and expire; an expired or reused link shows a plain-words message and a way to ask for a new one. | story-project-record-add-person#acceptance-criteria | test: `sign in with an email link` and `sign in with a passkey` |
| AC-14 | Every write in this slice goes through the command layer, which checks the principal's permissions read from the database for that request. A direct database write path from route handlers or pages does not exist. | story-project-record-add-person#acceptance-criteria | test: `writes go through the command layer` |
| AC-15 | The new pages (sign-in, organisation, project list, new project, project, add person) have no axe violations at WCAG 2.2 AA, work with the keyboard alone with a visible focus indicator, have no horizontal scroll at 320 CSS pixels, and allow paste and password managers on the email field. | story-project-record-add-person#acceptance-criteria | test: `slice 1 pages pass axe and keyboard checks` |

AC-13 serves "the new person can open the project", and AC-14 serves "the change takes effect the next time that person acts" (both story-project-record-add-person); how they are met follows decision-identity-and-roles and decision-project-record-model.

## Roles and permissions

Slice 1 has four permissions. Later slices add more to the same table.

| Role | Open the project in the dashboard | See people and roles | Manage people (add, change, remove roles) | Edit project name and brief |
|---|---|---|---|---|
| Director | yes | yes | yes | yes |
| Producer | yes | yes | yes | yes |
| Technical artist | yes | yes | no | no |
| Artist | yes | yes | no | no |
| Sound designer | yes | yes | no | no |
| Interaction designer | yes | yes | no | no |
| Capture crew | yes | yes | no | no |
| Show operator | yes | yes | no | no |
| Venue attendant | no (show-time tools only, Layer 4 and 5) | no | no | no |
| Performer | no (limited page, story-session-recording-record-agreement) | no | no | no |
| Collaborator | no (limited page, slice 10) | no | no | no |

Creating an organisation and creating a project are open to any signed-in person; creating a project in an organisation needs the person to look after that organisation. Renaming an organisation needs the same. These are organisation-level rights, not project roles.

## Scope

- In:
  - `contracts/`: role ids, permission ids, and request and response schemas for the endpoints below, versioned under `v1`.
  - `web/` database (Drizzle, with generated migrations): `person` (id, email, name), `organisation` (id, name, looked after by), `project` (id, organisation, name, brief, owner, created), `project_role` (project, person, role), plus the auth library's own tables. Ids are UUIDv7 (decision-project-record-model). Working state only; no history tables yet.
  - `web/src/record/`: the command layer. One function per command (create organisation, rename organisation, create project, add person, set roles, remove person), each taking a principal, loading permissions from the database, checking them, and writing in one transaction. A principal is `{ type: 'person' | 'agent-session', personId, channel }`.
  - API under `/api/v1`: `POST /organisations`, `PATCH /organisations/:id`, `GET /projects`, `POST /projects`, `GET /projects/:id`, `POST /projects/:id/people`, `PUT /projects/:id/people/:personId/roles`, `DELETE /projects/:id/people/:personId`. Each validates its body with the `contracts/` schema and calls the command layer.
  - Pages: sign-in, project list, new organisation, new project, project (details, organisation, people and roles), add person.
  - Sign-in with Better Auth: email links and passkeys, users in our Postgres. Sign-in emails go through a small mail interface. In tests and local work its transport writes each message to a capture directory that the end-to-end tests read; no message leaves the machine.
- Out:
  - Organisation facts, project facts, edit history, the identifier filter and the activity log: slice 2 (story-project-record-record-facts, story-project-record-set-up-organisation facts, story-agent-work-read-activity-log). The command layer gives each command one place where slice 2 adds the log entry and the identifier scan inside the same transaction.
  - Agent drafts of facts: slice 7. Agent principals exist in slice 1 only to prove refusal (AC-3).
  - Merging organisations, and moving a project between organisations: a later slice, with organisation facts.
  - Approvers, delegates and the four protected approvals: slice 3 (story-project-record-name-approvers).
  - Show machines and the package age in the pre-show check: Layers 4 and 5 (decision-offline-show-package).
  - A production email provider and any deployment: open questions below.

## APIs and assumptions

- Versions read from the npm registry on 2026-11-12, pinned exactly: better-auth 1.7.22 and @better-auth/passkey 1.7.22 (MIT; peer ranges include next 16, drizzle-orm 0.45 and drizzle-kit 0.31). Already in the workspace: Next.js 16.4.6, drizzle-orm 0.45.4, zod 4.6.7. A UUIDv7 generator is chosen when the tests are written: Postgres 18's built-in `uuidv7()` if the CI image and Aurora version provide it, otherwise the `uuidv7` package (1.2.1).
- Each API is checked against the installed package's types or docs before use (WA-006, NEXT-001).
- Assumptions that could be wrong:
  - [assumed] Better Auth 1.7's magic-link plugin gives single-use, expiring links and lets the app supply its own send function, and its Drizzle adapter works with our schema and migrations generated by drizzle-kit (not its own CLI writing to the database, PG-001). Settled when the tests are written.
  - [assumed] Better Auth's passkey plugin can be exercised in Playwright with a virtual WebAuthn authenticator through the Chromium DevTools protocol. If not, AC-13's passkey half is checked by hand in review and the spec says so.
  - [assumed] Better Auth's session lookup does not cache permissions; the app reads roles from `project_role` on each request (decision-identity-and-roles). The session carries identity only.
  - [assumed] Postgres 18 in CI and Aurora PostgreSQL in ca-central-1 support the same features this slice uses; Aurora's highest available major version is checked before the first deployment.

## Non-functional requirements

- Accessibility: WCAG 2.2 AA (WEB-001, WEB-002), errors in text next to each field and announced, keyboard-only use, paste allowed in sign-in fields (3.3.8).
- Security: every route checks the session and the permission on the server (SEC-002); request bodies are validated with `contracts/` schemas; no secrets committed (SEC-001); sign-in links are single-use; cookies are HTTP-only, Secure and SameSite=Lax.
- Privacy: people see only the people and roles on projects their roles open.
- Migrations generated and applied by the pipeline only (PG-001, PG-003).

## Delivery

- Plan item: design-architecture#build-order, slice 1.
- Pull requests: one, holding the failing tests first (recorded in `tests-commit`) and then the implementation.

## Risks and decisions

Approver's decisions (2026-11-12) on the questions this spec raised:

1. **Who may sign up?** No open sign-up. An account is made when someone is added to a project by email, or when a person on a short list of addresses kept in the deployment's settings signs in, so the first person can create the first organisation.
2. **Who may create organisations and projects?** Any signed-in person may create an organisation, and anyone who looks after an organisation may start projects in it.
3. **The owner's roles.** The owner gets director and producer at creation (AC-8), and can hand either over later.
4. **Which roles open the dashboard and manage people.** As in the table above: director and producer manage people; venue attendants, performers and collaborators use their own tools and pages, not the dashboard.
5. **Production email provider for sign-in links.** Amazon SES in ca-central-1, in the same AWS account and region as the record, so addresses and messages stay in Canada. Slice 9 (notifications) uses it too. Until slice 1 deploys, nothing is sent outside test capture.

Still to check before slice 1 deploys: which Postgres major versions Aurora PostgreSQL offers in ca-central-1. CI runs Postgres 18; if Aurora's newest is older, CI is pinned to that version and UUIDv7 comes from the `uuidv7` package rather than Postgres 18's built-in function `[assumed]`.

Other risks:

- The permission table, role ids and principal types are hard to reverse (decision-identity-and-roles). They live in `contracts/` and are versioned.
- Better Auth stores sessions and users in our database; its schema changes ride with its version, so its upgrades go through generated migrations like ours.
