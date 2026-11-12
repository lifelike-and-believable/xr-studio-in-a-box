---
id: decision-navigation-and-urls
status: draft
derived-from:
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

Ids are the record's UUIDv7 ids (decision-project-record-model), not names, so a rename never breaks a link. A page a person may not see answers the same "This page is not available" page, with the same status, whether it does not exist or their role does not allow it, so addresses do not reveal which projects exist (design-dashboard-shell). The one exception is a person who had a role on that project and lost it: they see "You no longer have access to this project" (design-people-and-roles).

A person who opens an address while signed out is asked to sign in and then taken to that address. Only paths on this site are followed after sign-in; anything else goes to `/projects` (design-sign-in).

## Consequences

- Later slices add project tabs and, in slice 4, a cross-project "What needs you" view as the home page for people who are on projects (story-review-and-status-what-needs-me). Until then, home is the project list.
- Renaming a project or organisation changes no address.
- Revisit if most people turn out to work across many projects at once, which would favour a task-first home.
