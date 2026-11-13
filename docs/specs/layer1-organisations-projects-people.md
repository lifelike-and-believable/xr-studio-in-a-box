---
id: spec-layer1-organisations-projects-people
status: implemented
derived-from:
  - docs-sign-in#accept-an-invitation: ea81ef051e97
  - docs-sign-in#what-you-see-the-first-time: 55017c219fb8
  - docs-sign-in#sign-in-with-an-email-link: ca701fbbf77f
  - docs-sign-in#if-the-email-does-not-arrive: caa08b37efda
  - docs-sign-in#add-a-passkey: 0586d53555c8
  - docs-sign-in#sign-in-with-a-passkey: 14f3c092eec5
  - docs-sign-in#sign-out: 3bff39b053ab
  - docs-sign-in#who-can-do-this: 29bc314a2061
  - docs-sign-in#the-first-person-on-a-new-installation: de382cf411d4
  - docs-sign-in#if-something-goes-wrong: 19f4f2ff5756
  - docs-sign-in#the-emails-xr-studio-sends: 29e7df8c437b
  - docs-your-projects#find-a-project: 920dbbcd7246
  - docs-your-projects#move-between-projects: cfafa2a8f7f8
  - docs-your-projects#your-account-and-signing-out: 37eb865924db
  - docs-your-projects#what-you-see-depends-on-your-roles: c2ab48583d70
  - docs-your-projects#if-something-goes-wrong: a5fe61c78855
  - docs-organisations-and-projects#create-an-organisation: 5c734ccbae2e
  - docs-organisations-and-projects#start-a-project: 7a9f06d62be0
  - docs-organisations-and-projects#roles-when-the-project-starts: 4e0f2abc848b
  - docs-organisations-and-projects#if-you-are-not-on-any-organisation-yet: eb5f28a840c2
  - docs-organisations-and-projects#change-a-projects-name-or-brief: c935b0ea7cdb
  - docs-organisations-and-projects#change-an-organisation: f358c113348f
  - docs-organisations-and-projects#an-organisations-page: ba859e5e9e18
  - docs-organisations-and-projects#see-your-organisations: 1d1f5655b61a
  - docs-organisations-and-projects#who-can-do-this: 32d64a12bc9a
  - docs-organisations-and-projects#if-something-goes-wrong: 535191ea052a
  - docs-people-and-roles#see-who-is-on-a-project: bdc60f86c2a4
  - docs-people-and-roles#add-a-person: 54f859712df5
  - docs-people-and-roles#send-an-invitation-again: 5e1a1f06f355
  - docs-people-and-roles#change-someones-roles: 7010d46c1d6a
  - docs-people-and-roles#changing-your-own-roles: e5b85461223f
  - docs-people-and-roles#remove-someone-from-a-project: ae68fb4a73e9
  - docs-people-and-roles#what-each-role-can-do: 164e4eb4b418
  - docs-people-and-roles#who-can-do-this: 3ed014ecda8d
  - docs-people-and-roles#if-something-goes-wrong: 9f8d3bf3bfab
  - design-sign-in: da4b611e6a00
  - design-dashboard-shell: a56bdc0e80ae
  - design-organisations-and-projects: 202a8d9fef23
  - design-people-and-roles: a2487b05978f
  - decision-navigation-and-urls: f6531b0599e9
  - decision-identity-and-roles#decision: 402e397cf1b0
  - decision-project-record-model#decision: cd1dfeb7a4dd
tests-commit: 8bd0a36
unlocks:
  - web/e2e/sign-in.spec.ts: AC-10. `getByRole('alert')` also matches the route announcer Next.js adds to every page (`#__next-route-announcer__`, role alert), so the strict locator failed; narrowed to the error summary by its name ("There is a problem"). No assertion changes.
  - web/e2e/organisations.spec.ts: AC-26, the same route-announcer clash; narrowed to the error summary by its name. No assertion changes.
  - web/e2e/people.spec.ts: AC-34, the same route-announcer clash; narrowed to the error summary by its name. No assertion changes.
  - web/e2e/slice1-accessibility.spec.ts: AC-38, the same route-announcer clash; narrowed to the error summary by its name. No assertion changes.
  - web/e2e/sign-in.spec.ts (again): AC-8. After **Add a passkey** the test waited for any "Made on" row, which a passkey left in the database by an earlier run already satisfies, so cookies were cleared before the new passkey was saved. It now waits for the count to go up by one, as AC-7 does. Also, its "device with no passkey" switched off simulated user presence, so the browser waited for a touch until the 60-second WebAuthn timeout instead of reporting no passkey (checked by hand: 265 ms with presence on, 60.3 s with it off); presence is now on, with no passkey stored. No assertion changes.
  - web/e2e/support/world.ts: the `addPerson` helper waited on "the People heading or a notice", a strict locator that fails when both appear, as they do after every add; it now takes the first. No assertion changes.
  - web/e2e/projects.spec.ts: AC-16 and AC-17. After Jordan presses **Remove Riley Chen** or **Save roles**, the test reloaded Riley's page at once. Both buttons submit a server action that runs after the click returns, so on a slower machine (CI) Riley's reload reached the server before the change was saved and saw the old roles. Reproduced locally by delaying Jordan's server action by 1.5 s: the AC-17 assertion fails exactly as in CI. The test now waits for Jordan's outcome notice (the change is saved) before Riley's next request. The product already applies changes at the next request after they are saved. No assertion changes.
  - web/e2e/organisations.spec.ts (again): AC-21. The same race: Jordan's context was closed straight after **Remove Sol Solo**, which could cancel the removal before it reached the server, leaving Sol on the seed project's organisation. The test now waits for the removal notice before closing. No assertion changes.
  - web/test/write-path.test.ts: AC-37. The test let any file in `src/record/` write, which is wider than the criterion ("every write goes through the command layer"). It now allows writes only in `src/record/commands.ts` and a named list of system writers, each with its reason: `mail.ts` (the record of emails sent, for the one-a-minute limit), `sign-in.ts` (sign-in requests, using up an invitation, replacing older sign-in links, linking an auth account to a person). The first-sign-in time that `principal.ts` wrote while rendering moved into the command layer (`recordFirstSignIn`). The assertion is narrowed, not weakened.
---

# Layer 1, slice 1: organisations, projects and people

## Problem

Nobody can sign in yet, and there is nowhere to put a project. Morgan needs to start a project; Jordan needs to put projects in an organisation and give people roles without technical help; a role change must apply the next time the person acts. Slice 1 builds what the approved user documentation promises for sign-in, the project list, organisations, projects, and people with roles, on the slice 0 skeleton, through the record's single write path (design-architecture, build order slice 1).

This spec derives from the approved user documentation (`docs/user/sign-in.md`, `your-projects.md`, `organisations-and-projects.md`, `people-and-roles.md`) and the approved designs it documents. It replaces the draft withdrawn in ce1a059, which derived straight from stories.

## User stories

- story-project-record-set-up-organisation, without organisation facts (slice 2).
- story-project-record-start-project, without merging organisations (a later slice).
- story-project-record-add-person, without show machines (Layers 4 and 5).

## Acceptance criteria

"Source" names the user documentation section each criterion comes from. A test cites a criterion as `layer1-organisations-projects-people#AC-1` in its title or a comment. Wording in quotes is the exact text the user documentation and designs give, and tests check it.

### Signing in

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-1 | **Sign in** asks for an **Email address** and has **Email me a sign-in link**. After a valid address the page is **Check your email**, identical in content and status whether or not the address can sign in. A sign-in link email is sent only if the address belongs to a person with at least one role that uses the dashboard on some project, or is listed in `SIGN_IN_FIRST_ADDRESSES`. No account is created for any other address. | docs-sign-in#sign-in-with-an-email-link | test: `email link sign-in is neutral and only sends to people who can sign in` |
| AC-2 | A sign-in link works once and for 15 minutes. Asking for a new link stops every older sign-in link for that address from working. Opening a used, expired or replaced link shows **This sign-in link no longer works** with **Send another link** (sends to the same address) and **Use a different email address**. | docs-sign-in#if-something-goes-wrong | test: `sign-in links are single use, expire after 15 minutes and are replaced by newer ones` |
| AC-3 | **Send another link** on **Check your email** shows "If this address can sign in, we have sent another link." At most one email a minute goes to an address, whichever action asked for it; a request inside that minute shows the same notice and sends nothing. | docs-sign-in#if-the-email-does-not-arrive | test: `at most one sign-in email a minute per address` |
| AC-4 | After signing in by link or passkey, the person lands on the page they asked for if they followed a link to a page in XR Studio while signed out, and otherwise on **Projects**. A return address that is not a path on the same site is ignored, and the person lands on **Projects**. | docs-sign-in#sign-in-with-an-email-link | test: `sign-in returns to the requested page, same site only` |
| AC-5 | An invitation link works once and for 7 days. Opening it signs the person in and opens the project's **Overview**. After that, it shows **This sign-in link no longer works** like any used link. | docs-sign-in#accept-an-invitation | test: `invitation links last 7 days and open the project` |
| AC-6 | On first sign-in a person with the Director or Producer role sees **Edit name and brief** on the **Overview** and the people actions; a person with any other dashboard role sees the name and brief and, on **People**, the list with a line naming who can make changes, and no edit or people actions. | docs-sign-in#what-you-see-the-first-time | test: `what each role sees the first time` |
| AC-7 | On **Your account**, **Add a passkey** registers a passkey, which is then listed with the device it was made on and the date. **Remove** beside it removes it and shows "Passkey removed. You can no longer use it to sign in." | docs-sign-in#add-a-passkey | test: `add and remove a passkey` |
| AC-8 | **Sign in with a passkey**, or picking a passkey the browser offers in the **Email address** field, signs the person in and lands as in AC-4. A failed or cancelled passkey shows "That passkey did not work." with **Try the passkey again** and the email form. | docs-sign-in#sign-in-with-a-passkey | test: `sign in with a passkey` |
| AC-9 | **Sign out** in the account menu ends the session and shows **You are signed out** with **Sign in again**. | docs-sign-in#sign-out | test: `sign out` |
| AC-10 | An empty or malformed **Email address** shows "Enter an email address, like name@example.com." in an error summary that takes focus and links to the field, the field's message is tied to it, and the page title starts "Error:". | docs-sign-in#if-something-goes-wrong | test: `sign-in email errors` |
| AC-11 | `SIGN_IN_FIRST_ADDRESSES` is a comma-separated list read at start-up (case-insensitive, spaces trimmed). A listed address can sign in by email link before anyone has added it, and its person record is created on first sign-in. There is no other way to get an account without being added to a project. | docs-sign-in#the-first-person-on-a-new-installation | test: `first addresses can sign in and nobody else can sign up` |
| AC-12 | The three emails (sign-in link, invitation, added to a project) have exactly the subjects and bodies the documentation gives, with the placeholders filled. In tests and local work every email is written to a capture directory and nothing leaves the machine. | docs-sign-in#the-emails-xr-studio-sends | test: `email texts match the user documentation` |

### Projects, navigation and access

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-13 | **Projects** lists every project on which the person has a role that uses the dashboard, each with its name, its organisation, **Your roles** and an **Owner** tag if they own it. With none, it says "You are not on any projects." and offers **Start a project** and **Create an organisation**. Selecting **XR Studio** in the header returns to **Projects**. | docs-your-projects#find-a-project | test: `projects list shows only the person's projects` |
| AC-14 | Inside a project the header has **Project: <project name>**, which lists the person's projects grouped by organisation, with **All projects** after the groups. The header also has **Projects** and **Organisations**. | docs-your-projects#move-between-projects | test: `project switcher groups projects by organisation` |
| AC-15 | Selecting the person's name opens a menu with **Your account** and **Sign out**. | docs-your-projects#your-account-and-signing-out | test: `account menu` |
| AC-16 | An address the person may not see gives **This page is not available** with **Go to your projects**, with the same status and content whether the page does not exist or the person's roles do not allow it. Only a person who had a role on that project and lost it sees "You no longer have access to this project" instead. A signed-in person none of whose roles uses the dashboard sees "Nothing in the dashboard for you yet". | docs-your-projects#if-something-goes-wrong | test: `not available, access removed and nothing for you` |
| AC-17 | A role change or removal applies at the person's next request: a page load or API call made after the change is answered with the new permissions, with no sign-out. | docs-your-projects#what-you-see-depends-on-your-roles | test: `role change applies at the next request` |

### Organisations and projects

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-18 | Any signed-in person can create an organisation with an **Organisation name** and **Looked after by** (themselves ticked; they may tick people from their projects). **Create organisation** opens the organisation's page. | docs-organisations-and-projects#create-an-organisation | test: `create an organisation` |
| AC-19 | **Start a project** asks for a **Project name** (required), a **Brief** (optional), an **Organisation** (one the person looks after or has projects in) and an **Owner** (the person, preselected, plus people on that organisation's projects; the list changes with the organisation). **When you start it** says which roles the person and the owner will have. **Start project** opens the **Overview** with the notice for that case, and the project appears on **Projects**. | docs-organisations-and-projects#start-a-project | test: `start a project` |
| AC-20 | The owner gets the Director and Producer roles. If the person starting chose someone else as owner, that person gets Director and Producer and the starter keeps Producer, and the notice says so as in the documentation's example. | docs-organisations-and-projects#roles-when-the-project-starts | test: `roles when a project starts` |
| AC-21 | A person on no organisation sees that a new organisation with the project's name will be made; starting the project makes it, with that plain name, places the project in it and makes the person look after it. | docs-organisations-and-projects#if-you-are-not-on-any-organisation-yet | test: `start a project with a default organisation` |
| AC-22 | Only the project's Director or Producer sees **Edit name and brief**; saving shows "Name and brief saved." Everyone else sees who can make changes. | docs-organisations-and-projects#change-a-projects-name-or-brief | test: `edit a project's name and brief` |
| AC-23 | Only people who look after an organisation see **Edit organisation**; they can change its name and **Looked after by**, and saving shows "Organisation saved." An organisation always keeps at least one person looking after it: the last one cannot be unticked. | docs-organisations-and-projects#change-an-organisation | test: `edit an organisation and keep someone looking after it` |
| AC-24 | An organisation's page shows its name, **Looked after by**, **Start a project in this organisation**, **Edit organisation** (to people who look after it), **Projects** (those the person is on, or all of them for people who look after it) and an empty **Organisation facts** section. | docs-organisations-and-projects#an-organisations-page | test: `organisation page contents` |
| AC-25 | **Organisations** lists the organisations the person looks after and those of projects they are on, with a **You** column reading "Look after it" or "On its projects". | docs-organisations-and-projects#see-your-organisations | test: `organisations list` |
| AC-26 | Starting, creating and editing show the documented errors, keep everything else typed, and create or change nothing: "Enter the project name.", the duplicate project name within the same organisation (the same name is allowed in another organisation), "Enter the organisation name.", the duplicate organisation name among those the person looks after, and "The person you chose can no longer own a project here. Choose another owner." A second submit while the first is in progress creates nothing more. | docs-organisations-and-projects#if-something-goes-wrong | test: `organisation and project errors` |
| AC-27 | Commands from an agent-session principal to create an organisation, move a project between organisations, add a person, or give, change or remove a role are refused, whatever roles the person it acts for holds. Starting a project needs the person to look after the organisation or have projects in it; editing an organisation needs them to look after it. | docs-organisations-and-projects#who-can-do-this | test: `who can create and edit organisations and projects` |

### People and roles

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-28 | **People** lists everyone on the project with their roles, an **Owner** tag beside the owner, and a status: **Signed in** (has signed in at least once), **Invited, not signed in yet**, or **No dashboard access** (no role on this project uses the dashboard). | docs-people-and-roles#see-who-is-on-a-project | test: `people list and statuses` |
| AC-29 | A Director or Producer can **Add a person** with an **Email address** (required), a **Name** (optional; the email is shown when empty) and one or more **Roles**, each shown with what it is for and what it gives today as in the role table. **Before you add <name>** sums up what they will be able to do and whether they get an email. | docs-people-and-roles#add-a-person | test: `add a person` |
| AC-30 | The outcome depends on the roles, with the documented notice for each: at least one dashboard role and new to XR Studio gives an invitation email; already using XR Studio gives the "added to a project" email; only Performer, Collaborator or Venue attendant gives no email and no dashboard account. | docs-people-and-roles#add-a-person | test: `what an added person gets` |
| AC-31 | **Send the sign-in link again** beside a person who has not signed in sends a new 7-day invitation link, stops the older one from working, and shows "We have sent <name> a new invitation link to <email>. It lasts 7 days. You can send another in a minute." A second send within a minute is refused with "You can send another in a minute". | docs-people-and-roles#send-an-invitation-again | test: `send an invitation again` |
| AC-32 | **Change roles or remove**, then **Save roles**, saves the roles and shows "<name>'s roles saved: <roles>." Removing (by **Remove <name> from the project** then **Remove <name>**, or by unticking every role and confirming) shows "<name> removed from <project>. Their past work stays on the project." **Keep <name>** goes back without change. | docs-people-and-roles#remove-someone-from-a-project | test: `change roles and remove a person` |
| AC-33 | When a person edits their own roles, **Before you save** says whether they will still be able to add people and change roles, and who else can. A change that would leave the project with nobody holding Director or Producer is refused with the documented message, and the role stays. | docs-people-and-roles#changing-your-own-roles | test: `last manager and self edit` |
| AC-34 | Adding shows the documented errors and keeps what was ticked: "Enter an email address, like name@example.com.", "Choose at least one role.", and "<name> is already on this project. Use Change roles or remove for <name> to change what they can do." If the email cannot be sent, the person is still added and a notice says the email could not be sent. | docs-people-and-roles#if-something-goes-wrong | test: `add a person errors` |
| AC-35 | The permission table covers all eleven roles as the role table says: Director and Producer open the project, see people, manage people and edit the name and brief; the other dashboard roles open the project and see people; Venue attendant, Performer and Collaborator open nothing in the dashboard. A person with two roles holds the union. No role carries an approval. | docs-people-and-roles#what-each-role-can-do | test: `permission table matches the role table` |
| AC-36 | Only Director and Producer see and can use the people actions; others see the list without them and a line naming who can make changes, and the API refuses them (403). | docs-people-and-roles#who-can-do-this | test: `only managers can change people` |
| AC-37 | Every write in this slice goes through the command layer, which reads the principal's roles from the database for that request; route handlers and pages have no other write path. | docs-people-and-roles#change-someones-roles | test: `writes go through the command layer` |

### Accessibility

| # | Criterion | Source | Verified by |
|---|---|---|---|
| AC-38 | Every page in this slice has no axe violations at WCAG 2.2 AA, works with the keyboard alone with a visible focus indicator, has no horizontal scroll at 320 CSS pixels, and allows paste and password managers in email fields. On a failed submit focus moves to the error summary and the page title starts "Error:"; after a successful action focus moves to the notice and the page title starts with the outcome; in the remove dialog focus starts on its heading. | design-sign-in, design-dashboard-shell, design-organisations-and-projects, design-people-and-roles (Accessibility sections) | check: the end-to-end suite `slice 1 pages pass axe and keyboard checks`, run in CI |

AC-38's source is the designs' Accessibility sections, not a user documentation section, because the documentation does not describe accessibility behaviour. It is written as a `check:` so the process check's rule for `test:` sources does not apply; it is still automated and runs in CI.

## Roles and permissions

| Role | Open the project | See people and roles | Manage people | Edit name and brief |
|---|---|---|---|---|
| Director | yes | yes | yes | yes |
| Producer | yes | yes | yes | yes |
| Technical artist, Artist, Sound designer, Interaction designer, Capture crew, Show operator | yes | yes | no | no |
| Venue attendant, Performer, Collaborator | no | no | no | no |

Creating an organisation is open to any signed-in person. Starting a project in an organisation needs the person to look after it or have projects in it. Editing an organisation needs the person to look after it. These are organisation-level rights, not project roles.

## Scope

- In:
  - `contracts/`: role ids, permission ids, and request and response schemas for the endpoints below, under `v1`.
  - Database (Drizzle, generated migrations; UUIDv7 ids, decision-project-record-model):
    - `person` (id, email, name, auth user id or none, first signed in at): a person added only with roles that do not use the dashboard has no auth user.
    - `organisation` (id, name) and `organisation_steward` (organisation, person): "Looked after by".
    - `project` (id, organisation, name, brief, owner, created at), unique (organisation, lower(name)).
    - `project_role` (project, person, role), and `project_role_removed` (project, person, removed at) so "access removed" can be told apart from "not available".
    - `invitation` (id, person, project, token hash, expires at, used at, replaced at).
    - `email_send` (address, sent at, kind) for the one-a-minute limit.
    - Better Auth's own tables (user, session, account, verification, passkey), generated as Drizzle migrations, not by its CLI against a database (PG-001).
  - `web/src/record/`: the command layer. One function per command (create organisation, edit organisation, start project, edit project, add person, set roles, remove person, resend invitation), each taking a principal, reading roles from the database, checking permissions, and writing in one transaction. A principal is `{ type: 'person' | 'agent-session', personId, channel }`.
  - API under `/api/v1`, each body validated with its `contracts/` schema and each call going to the command layer:
    - `GET /projects`, `POST /projects`, `GET /projects/:id`, `PATCH /projects/:id`
    - `GET /projects/:id/people`, `POST /projects/:id/people`, `PUT /projects/:id/people/:personId/roles`, `DELETE /projects/:id/people/:personId`, `POST /projects/:id/people/:personId/invitation`
    - `GET /organisations`, `POST /organisations`, `GET /organisations/:id`, `PATCH /organisations/:id`
    - `POST /sign-in/link` (the neutral request of AC-1 and AC-3), and `GET /invitations/:token` (AC-5).
    - Better Auth's own routes (magic link verification, passkeys, sign-out) are mounted under `/api/auth/` as the library expects.
  - Pages at the addresses in decision-navigation-and-urls: `/sign-in`, `/` (Projects), `/projects/new`, `/projects/<id>`, `/projects/<id>/people`, `/projects/<id>/people/new`, `/projects/<id>/people/<person id>`, `/organisations`, `/organisations/new`, `/organisations/<id>`, `/organisations/<id>/edit`, `/account`, the signed-out page and the not-available page.
  - Mail: a small interface with one transport. In tests and local work the transport writes each message to a capture directory that the end-to-end tests read. The production transport (Amazon SES) is out of scope here and is added before the first deployment.
- Out:
  - Organisation facts and their drafts, flags and history: slice 2 (story-project-record-set-up-organisation criteria 2 to 5, story-project-record-record-facts).
  - The identifier filter and the activity log: slice 2 (story-agent-work-read-activity-log). Each command has one place, inside its transaction, where slice 2 adds the log entry and the identifier scan.
  - Agent drafts: slice 7. Agent-session principals exist here only to prove refusal (AC-27).
  - Merging organisations, handing on ownership, and changing a person's email: a later slice, not yet in the build order (the user documentation says "a later release").
  - Approvers and the four protected approvals: slice 3 (story-project-record-name-approvers).
  - Show machines getting role changes at their next show-package refresh: Layers 4 and 5 (decision-offline-show-package).
  - Performers' and collaborators' own pages: story-session-recording-record-agreement (Layer 2) and slice 10.
  - The production email transport and any deployment.

## APIs and assumptions

- Versions read from the npm registry on 2026-11-12, pinned exactly: better-auth 1.7.22 and @better-auth/passkey 1.7.22 (MIT). better-auth's peer ranges include next ^16, drizzle-orm ^0.45.2, drizzle-kit >=0.31.4, pg ^8 and vitest up to ^5. Already in the workspace: Next.js 16.4.6, drizzle-orm 0.45.4, drizzle-kit 0.31.11, zod 4.6.7. UUIDv7 comes from the `uuidv7` package unless the Aurora check below shows Postgres 18 is available.
- Checked on 2026-11-12 against the published 1.7.22 type definitions (`dist/plugins/magic-link/index.d.mts`, `@better-auth/passkey/dist/client.d.mts`):
  - The magic-link plugin consumes each token on its first verification ("a given token mints at most one session"), takes an app-supplied `sendMagicLink`, accepts `callbackURL`, and has `disableSignUp`. So single use, our own mail transport, the return page (AC-4) and no open sign-up (AC-11) map onto it.
  - Its `expiresIn` is one value for the whole plugin (default 300 seconds). It is set to 900 for sign-in links. **It cannot give invitation links a different lifetime**, so invitations (AC-5, AC-31) are our own `invitation` records with a 7-day expiry, checked by `GET /invitations/:token`, which then starts a session for the person.
  - Its `rateLimit` is a request window, not a per-address email limit, so the one-a-minute rule (AC-3, AC-31) is our own check against `email_send`.
  - Replacing older links (AC-2) is our own step: before sending, earlier unused sign-in tokens for the address are deleted.
  - The passkey client's `signIn.passkey` takes `autoFill: boolean`, so picking a passkey from the browser's list in the email field (AC-8) is supported by the library.
- Release-age exemption: better-auth 1.7.22 and its `@better-auth/*` packages were published inside pnpm's minimum release age, so `pnpm-workspace.yaml` lists them under `minimumReleaseAgeExclude`. Remove those entries once 1.7.22 is older than the release-age window (the next dependency update after that date), so the exemption does not outlive its reason.
- Each API is checked against the installed package's types or docs before use (WA-006, NEXT-001).
- Assumptions that could be wrong:
  - [assumed] A session can be started from our invitation route through Better Auth's server API (its internal adapter or a one-time magic-link token minted server-side and verified at once). Settled when the tests are written; if neither works, the invitation route mints a magic-link token and redirects to its verify URL, which keeps the 7-day check in our record.
  - [assumed] With `disableSignUp`, a first address (AC-11) needs its auth user created before the link is sent; the request route does this for listed addresses only.
  - [assumed] Passkeys can be exercised in Playwright with a virtual WebAuthn authenticator through the Chromium DevTools protocol, including autofill. If autofill cannot be driven there, that half of AC-8 is checked by hand in review and recorded here.
  - [assumed] Better Auth's session carries identity only and caches no permissions; roles are read from `project_role` on each request (decision-identity-and-roles).
  - [assumed] Postgres 18 in CI and Aurora PostgreSQL in ca-central-1 support the same features this slice uses; Aurora's newest major version is checked before the first deployment, and CI is pinned to it if it is older.

- Settled while building (2026-11-12):
  - Starting a session from an invitation: the invitation route takes a sign-in link from the auth library inside an `AsyncLocalStorage` store, instead of mailing it, and redirects to it with the project as the return page. Requests from outside never run inside that store, so they can only cause an email. The 7-day check stays in our `invitation` record.
  - First addresses: the request route makes the auth account for a listed address before sending its link, so `disableSignUp` stays on for everyone else. The auth library's own `/sign-in/magic-link` route also sends only to people who may sign in (AC-11 tests it).
  - Passkeys: Better Auth 1.7.22 with `residentKey: 'required'`, so a passkey signs a person in without their address. The button path and a device with no passkey are tested with Playwright's virtual WebAuthn authenticator. Sign-in from the browser's autofill list is wired (`autocomplete="username webauthn"`, a conditional request started when the email field gets focus) but a virtual authenticator cannot pick from the autofill list, so that half of AC-8 is to be checked by hand in review. A button press cancels a pending autofill request, and Chromium can fail the first request after that cancellation, so the button tries once more.
  - Sessions hold identity only; roles are read from `project_role` on every request (AC-17 tests it).
  - UUIDv7 ids come from the `uuidv7` package, so nothing depends on Postgres 18.
  - The one-a-minute limit (AC-3, AC-31) applies to emails that carry a link a person can ask for again and again: sign-in links and invitations. An "added to a project" email follows one person's add and is always sent.
  - The auth library's own per-IP rate limits are raised (600 a minute overall, 120 for magic links) so a studio behind one IP address is not blocked; the per-email limit above is the real control.
  - One more table beyond the Scope list: `sign_in_request` (id, email, return page), so **This sign-in link no longer works** can send another link to the same address without putting the address in the link.

## Non-functional requirements

- Accessibility: AC-38 (WEB-001, WEB-002).
- Security: every route checks the session and the permission on the server (SEC-002); bodies are validated with `contracts/` schemas; sign-in and invitation tokens are stored hashed and are single use; cookies are HTTP-only, Secure and SameSite=Lax; the return address of AC-4 is same-site only; **Check your email** never reveals who can sign in; no secrets committed (SEC-001).
- Privacy: people see only the people and roles on projects their roles open, and only the organisations they look after or have projects in.
- Migrations are generated and applied by the pipeline only (PG-001, PG-003).

## Delivery

- Plan item: design-architecture#build-order, slice 1.
- Pull requests: one, holding the failing tests first (recorded in `tests-commit`) and then the implementation. The partial build set aside on 2026-11-12 is not reused as is; anything taken from it is checked against this spec first.

## Risks and decisions

Approver's decisions (2026-11-12):

1. No open sign-up. An account is made when someone is added to a project with a dashboard role, or when a person whose address is in `SIGN_IN_FIRST_ADDRESSES` signs in.
2. Any signed-in person may create an organisation. Anyone who looks after an organisation, or has projects in it, may start projects in it.
3. The owner gets Director and Producer at creation; if someone else is named owner, the starter keeps Producer. Ownership cannot be handed on yet.
4. Director and Producer manage people. Venue attendants, performers and collaborators have no dashboard account; adding them sends no email.
5. Sign-in links last 15 minutes and are single use; invitation links last 7 days and are single use; at most one email a minute per address.
6. Removing the last Director or Producer is refused.
7. Production email: Amazon SES in ca-central-1, in the same AWS account and region as the record. Slice 9 (notifications) uses it too. Until slice 1 deploys, nothing is sent outside the test capture.
8. Sending an invitation again replaces the earlier invitation link: only the newest works (AC-31) (approver's decision, 2026-11-12).
9. Accessibility (AC-38) stays an automated check sourced from the designs' Accessibility sections, run in CI (approver's decision, 2026-11-12).

Before slice 1 deploys: check which Postgres major versions Aurora PostgreSQL offers in ca-central-1, and that Vercel's AWS Marketplace region picker offers Canada (Central) (decision-project-record-model).

Other risks:

- The permission table, role ids and principal types are hard to reverse (decision-identity-and-roles). They live in `contracts/` and are versioned.
- Better Auth stores users, sessions and passkeys in our database; its schema changes ride with its version, so its upgrades go through generated migrations like ours.
- Invitations bypass Better Auth's own token store. They follow the same rules (hashed, single use, expiring), and AC-5 and AC-31 test them.
