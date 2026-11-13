---
id: decision-navigation-and-urls
status: approved
derived-from:
  - story-project-record-set-up-organisation#acceptance-criteria: eb7a4e1f7ca0
  - story-project-record-start-project#acceptance-criteria: 83fa11a80149
  - story-project-record-add-person#acceptance-criteria: 8f5b1df665e2
  - story-review-and-status-what-needs-me#acceptance-criteria: 69b7764b8c65
  - epic-project-record#outcome: c7917e3ef44b
  - persona-producer#goals: d1cc47b03be9
  - persona-director#frustrations: 3721421a3614
---

# Decision: the dashboard is organised by project, with stable URLs per project

## Context

Slice 1 adds the dashboard's first screens: sign-in, projects, organisations and people. Every later slice (facts, the review queue, the status board, chat, budgets) adds screens to the same frame, so where things live and what their addresses are has to be settled once. Jordan, the producer, works across several projects at once and needs to bring people on quickly. Morgan, the director, needs one place per brief and a queue that does not get lost. People get links by email (sign-in, later notifications), so addresses must keep working.

## Options

| Option | For | Against |
|---|---|---|
| A. Project first: a top-level list of projects; each project has its own area with tabs (Overview, People, and later Facts, Review, Board); a project switcher in the header. Organisations are a second top-level section. | Matches how roles work (roles are per project). Links in emails point at one project's page. Later slices add a tab, not a new structure. | Work across projects (one person's whole review queue) needs its own view, added in slice 4 (story-review-and-status-what-needs-me). |
| B. Organisation first: organisation, then its projects, then each area. | Mirrors ownership. | Most people never look after an organisation; it adds a level they must click through. Roles are per project, not per organisation. |
| C. Task first: top-level Review, Board, People, Facts, each filtered by project. | Good for cross-project work. | A person with different roles on two projects sees mixed permissions on one screen; harder to keep "sees only what their role allows" clear. |

## Decision

Option A. The main navigation has Projects and Organisations. Inside a project, a header switcher shows the current project and lists the projects the person is on, grouped by organisation, with **All projects** after the groups. Each project has tabs; slice 1 has Overview and People.

Addresses (the user documentation names pages, not addresses, so these can change behind redirects, but links already sent by email must keep working):

| Page | Address |
|---|---|
| Sign in | `/sign-in` |
| Your projects (home after sign-in) | `/projects` |
| Start a project | `/projects/new` |
| A project's overview | `/projects/<project id>` |
| A project's people | `/projects/<project id>/people` |
| Add a person | `/projects/<project id>/people/new` |
| Change one person's roles | `/projects/<project id>/people/<person id>` |
| Organisations | `/organisations` |
| Create an organisation | `/organisations/new` |
| An organisation | `/organisations/<organisation id>` |
| Edit an organisation | `/organisations/<organisation id>/edit` |
| Your account (passkeys) | `/account` |
| A project's facts (added with the slice 2 designs) | `/projects/<project id>/facts` |
| Edit one project fact | `/projects/<project id>/facts/<fact>/edit` |
| One project fact's earlier versions and compare | `/projects/<project id>/facts/<fact>/history` |
| Confirm text in a project fact is not an identifier | `/projects/<project id>/facts/<fact>/confirm` |
| A project's work samples | `/projects/<project id>/facts/work-samples` |
| A project's activity | `/projects/<project id>/activity` |
| Edit one organisation fact | `/organisations/<organisation id>/facts/<fact>/edit` |
| One organisation fact's earlier versions and compare | `/organisations/<organisation id>/facts/<fact>/history` |
| Confirm text in an organisation fact is not an identifier | `/organisations/<organisation id>/facts/<fact>/confirm` |
| An organisation's standard work samples | `/organisations/<organisation id>/work-samples` |
| Add a format | `/organisations/<organisation id>/identifier-formats/new` |
| An organisation's identifier formats | `/organisations/<organisation id>/identifier-formats` |
| An organisation's activity | `/organisations/<organisation id>/activity` |
| A project's review queue (added with the slice 3 designs) | `/projects/<project id>/review` |
| Send for review | `/projects/<project id>/review/new` |
| Sent by you | `/projects/<project id>/review/sent` |
| One review item | `/projects/<project id>/review/<item id>` |
| A project's approvers | `/projects/<project id>/approvers` |
| Change an area's approver and delegate | `/projects/<project id>/approvers/<area>` |
| Change a protected approval's holder | `/projects/<project id>/approvers/protected/<approval>` |

The `<fact>` part is a fixed slug, never an id: for projects `description`, `plan`, `budget`, `credits`, `collaborators`, `schedule`, `capacity`; for organisations `legal-name`, `bio`, `company-history`, and `funder-profile-<funder>` with the funder slugs `canada-council-for-the-arts`, `canada-media-fund`, `creative-bc` and `epic-megagrants` (added with the slice 2 designs). Work samples have their own page rather than an edit page. The `<area>` part is `creative`, `performance-and-behaviour`, `builds-and-operations` or `business`, and `<approval>` is `contracts-and-licence-terms`, `funding-applications-and-reports`, `publishing-and-marketing` or `audience-facing-safety-and-consent` (added with the slice 3 designs).

Ids are the record's UUIDv7 ids (decision-project-record-model), not names, so a rename never breaks a link. A page a person may not see answers the same "This page is not available" page, with the same status, whether it does not exist or their role does not allow it, so addresses do not reveal which projects exist (design-dashboard-shell). The one exception is a person who had a role on that project and lost it: they see "You no longer have access to this project" (design-people-and-roles).

A person who opens an address while signed out is asked to sign in and then taken to that address. Only paths on this site are followed after sign-in; anything else goes to `/projects` (design-sign-in).

## Consequences

- Later slices add project tabs and, in slice 4, a cross-project "What needs you" view as the home page for people who are on projects (story-review-and-status-what-needs-me). Until then, home is the project list.
- Renaming a project or organisation changes no address.
- Revisit if most people turn out to work across many projects at once, which would favour a task-first home.
