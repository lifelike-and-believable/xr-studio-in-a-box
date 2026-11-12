---
id: decision-offline-show-package
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - epic-review-and-status#outcome: adfddef70e61
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-show-operator#goals: 408315e4f8f6
---

# Decision: show machines read a signed show package and write a venue log that joins the record later

## Context

Layer 1 builds no show machine code, but some of its records have to reach one:

- Accepted starter values are used with every agent and the internet disconnected (story-review-and-status-starter-targets).
- Only approved versions run in show mode (story-show-safety-switch-modes).
- Only a person at the show whose role allows it makes a change during a live run. The change is logged, and after the session it goes to the review queue (story-session-operations-live-changes).
- Logs written at the show machine work with no internet and survive a power cut (story-unattended-running-maintenance-and-log).

The record lives in the cloud (decision-system-shape), and the venue may have no internet (REQ-delivery-5). The format chosen now decides what Layers 4 and 5 can do. Alex needs every show control to work with no internet. Sam needs the show to keep running when agents and the internet are gone.

## Options

| Option | For | Against |
|---|---|---|
| A. The record exports a signed, versioned show package for each show and target. The show machine reads it and writes its own append-only venue log, which it uploads when a connection exists. | The show machine depends on nothing outside the venue. It holds only what the show needs. Upload is idempotent and order-safe. | People and roles at the venue are a snapshot: a change reaches the machine only at its next package refresh. |
| B. A venue node: a full replica of the record that syncs whenever online | Dashboards keep working at the venue. Changes flow as soon as a link exists. | Two writable copies of the record means conflict rules for every table. A second server sits in every venue. Far more than any approved story needs. |
| C. Show machines read and write the cloud record live | One copy. | Breaks REQ-delivery-5 and story-show-safety-without-agents. |

## Decision

Option A.

- **The package** holds approved versions only (or references to them in the build), the accepted starter values, the people named for the show with their roles and an offline credential for each (a hashed PIN or a hardware key, decided in Layer 4 `[assumed]`), the term end dates that affect the show, and its own id and version. It is signed by the record. The show machine checks the signature and never edits the package.
- **The venue log** is append-only. Each entry has a UUIDv7 id, the machine's id, a sequence number and the wall-clock time. It covers mode switches, changes during a live run with their approvals, maintenance events, and operations the show stories log. It holds no guest data.
- **Upload.** When a connection exists, the machine uploads entries it has not sent before. The record appends them to the activity log and creates the review items story-session-operations-live-changes asks for. Sending the same entry twice changes nothing.
- **Refresh.** The pre-show check (Layer 4) shows the package version and its age. It warns when a newer approved package exists `[assumed]`.

The package and log schemas live in `contracts/` and are versioned.

## Consequences

- Hard to reverse: the package and venue log formats, and the rule that show machines never write to the record directly.
- A role removed in the dashboard reaches an offline show machine only at its next refresh, and the pre-show check shows the package's age (approver's decision, 2026-11-12). story-project-record-add-person is amended to say so.
- Layer 1 must keep every record a package needs exportable: accepted values, approved versions and roles. Nothing more is built for show machines now.
- Revisit for multi-location shows (REQ-delivery-4, later), which may need live shared state between venues.
