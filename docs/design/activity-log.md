---
id: design-activity-log
status: approved
derived-from:
  - story-agent-work-read-activity-log#acceptance-criteria: 1649ac451653
  - story-contracts-and-payment-protect-sensitive-data#acceptance-criteria: 2b9128383b81
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
  - decision-project-record-model#decision: cd1dfeb7a4dd
---

# Activity log design

A log of everything done on a project, which nobody can edit or remove (story-agent-work-read-activity-log). Slice 2 builds the log and fills it with people's actions: facts, people and roles, identifier confirmations, and the project itself. Agent actions, with their stage and tool, are added from slice 7, when agents arrive; the page is designed for them now. Organisations get their own activity page for changes to the organisation, its facts and its identifier formats.

## Personas

- persona-technical-artist: Sam opens the log to see what happened and why something failed, filters it by who did it, area and date (goals), and from slice 7 by agent, stage and tool.
- persona-producer: Jordan checks who changed a fact or a role, and that an identifier confirmation was recorded.

## Flow

1. On a project, the **Activity** tab lists entries newest first: **When**, **Who**, **What** and **Area**. Fifty at a time, with **Older entries**.
2. Filters above the list: **Who** (each person on the project, and **Agents**), **Area** (Project, Facts, People, and later areas as slices add them), **From** and **To** dates. **Apply filters** and **Clear filters**. The result line says how many entries match.
3. An entry names what was done in words ("Saved the description", "Changed Riley Chen's roles to Artist and Sound designer", "Confirmed that text in the description is not a bank account number ("Catalogue number for the lantern prop")"). It never contains the text or figures of a fact, and never an identifier.
4. Entries made through Claude Code name the person and the channel: "Sam Okafor via Claude Code" (decision-agent-runtime).
5. From slice 7, an agent entry names the project, stage, tool and the person who requested or approved it (story-agent-work-read-activity-log), and **Who** can be filtered by agent and by **Stage**.
6. An entry removed under a retention rule (from the keep-records story) stays in the list as an entry of its own: "A record from <date> was deleted at the end of its retention period (<rule>). Its content is gone; this entry stays."
7. On an organisation page, people who look after it have **Activity** for the organisation's own changes.

## Who can open the log

| Log | Who |
|---|---|
| A project's activity | Director, Producer, Technical artist |
| An organisation's activity | People who look after the organisation |

Other roles do not see the **Activity** tab; opening its address gives "This page is not available" (design-dashboard-shell). Entries about a fact a reader may not see (the budget, for example) show only that it was saved, with no value, as every entry does.

## Mock-ups

| Screen or state | Mock-up | Notes |
|---|---|---|
| Project activity, as Sam | ![Activity](activity-log/activity.png) | Phone: ![Activity at 320px](activity-log/activity-phone.png) |
| Filtered by person and area | ![Filtered](activity-log/activity-filtered.png) | The result line is a status message. |
| No entries match | ![No match](activity-log/activity-none.png) | Says agents arrive in a later release. |
| An entry left by a retention deletion (later release) | ![Retention entry](activity-log/activity-retention.png) | Shown as its own entry. |
| Organisation activity | ![Organisation activity](activity-log/org-activity.png) | |

## Layout

- **Activity** is the last project tab, shown only to roles that may read it. On an organisation page, **Activity** is a link for people who look after it.
- The list is a table on wide screens and one block per entry at 320 pixels, each value labelled.
- Control names: **Activity**, **Who**, **Area**, **From**, **To**, **Apply filters**, **Clear filters**, **Older entries**.

## States and errors

- **No entries match:** "No entries match these filters." with **Clear filters**. Filtering by **Agents** in slice 2 adds "Agents arrive in a later release, so there are no agent entries yet."
- **From after To:** "Choose a From date before the To date." Values kept.
- **No way to change an entry:** there is no edit or delete control anywhere, and the API has none.

## How it works

- **How does the system know?** The activity log is an append-only ledger in the record (decision-project-record-model). Each command writes its entry in the same transaction as its change, so an entry exists exactly when the change does.
- **What enforces each promise?**
  - "Nobody can edit or remove an entry": the application's database role can insert into the log but cannot update or delete it. Only the separate retention role can remove an entry's content, and it leaves its own entry. A database test tries an update and a delete as the application role and both are refused.
  - "Every action is logged": every command writes its entry; there is no write path outside the command layer. A test runs each slice 2 command and checks its entry.
  - "No identifiers or fact values in the log": entries are built from the command's name and the names of what changed, never from field values; the identifier test searches the log for test identifiers and finds none.
  - "Only some roles can open the log": checked per request. A test signs in with each role.
- **What is published together?** Not applicable.

## Accessibility

- The list is a table with a caption and column headers on wide screens; at 320 pixels each entry is a block with labelled values.
- The result line after filtering is a polite status message. Date fields have visible labels.
- All mock-ups were checked with axe (WCAG 2.2 AA tags) with no violations, and the phone frame has no horizontal scrolling.

## Open items

- Agent entries with stage and tool, and filters by agent and stage: slice 7.
- Retention deletions: with story-contracts-and-payment-keep-records.
- Erasure requests against the log: pending the legal review (decision-project-record-model).
