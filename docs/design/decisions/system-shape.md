---
id: decision-system-shape
status: draft
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-director#goals: a92ca172be83
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
---

# Decision: a cloud project record with a separate agent runner, and show machines that read an exported package

## Context

Layer 1 needs a web dashboard, chat with an agent, and limited pages that collaborators open from an email (REQ-workflow-17, REQ-governance-6). Later layers add panels in the Unreal Editor and an operator console. The same layers also set hard limits on where things run:

- Shows run on the venue network with no internet (REQ-delivery-5), and no live function depends on an agent (REQ-workflow-9).
- Epic's Unreal MCP plugin in 5.8 is editor-only, listens on loopback only, and has no authentication (docs/research/notes/engine-delivery-qa.md). An agent that drives the editor has to run on the same machine as the editor.
- The Claude Agent SDK (0.3.322, checked 2026-11-12) runs each session as a separate Claude Code process. It cannot live inside a short web request: Vercel functions default to 300 seconds (NODE-001).
- Collaborators and funders reach their pages from anywhere, so something has to be on the public internet.

Morgan may run a production alone, so whatever runs must not need a pipeline engineer to keep it up. Sam has to be able to see where each part runs and replace one part at a time.

## Options

| Option | For | Against |
|---|---|---|
| A. Cloud record and dashboard (Next.js and Postgres, the web-app profile). A separate, long-running agent runner connects out to it. Unreal plugins are clients of the same API. Show machines read an exported show package. | Collaborators, remote crew and email all work with no studio networking. Managed backups. Fits the rfr web-app profile. The runner can sit beside the editor when Layer 3 needs it. | Monthly hosting cost. Venues need a separate offline path (decision-offline-show-package). Data region depends on the provider. |
| B. Everything on one studio server (Next.js, Postgres and the runner), reached over a tunnel. | Data stays in-house. Storing large binaries is cheap. One machine to reason about. | Someone has to patch it, back it up and keep it up, which a solo production cannot do. Collaborator pages depend on the studio's connection. The venue still needs an offline path. |
| C. Local-first: every machine holds a replica that syncs (for example PGlite with Electric). | Works offline everywhere, including the dashboard at a venue. | Permission checks and the policy gate would run on machines we do not control. Partial replication by role is hard. The sync engines are young (PGlite 0.5.x). It is more machinery than any approved story needs. |
| D. A desktop application per person, sharing one database. | Rich offline editor-like tools. | Collaborators cannot install software for one review. Each platform has to be packaged and updated. |

## Decision

Option A, the cloud (approver's decision, 2026-11-12). It meets the stories with the least to run. The parts that need offline running (show machines) or a local editor (the runner in Layer 3) are kept at the edges, so they do not shape the record.

| Part | Sub-project (profile) | Runs on | Talks to |
|---|---|---|---|
| Project record, API, dashboard, limited pages | `web/` (web-app: Next.js on Vercel, Postgres) | Cloud | Everyone, over HTTPS `/api/v1`, and technical roles' Claude Code through an MCP endpoint over the same command layer (decision-agent-runtime) |
| Object storage for asset versions and backups | Managed storage | Cloud | Uploads go direct, from a URL signed by the record (NODE-001's 4.5 MB body limit) |
| Agent runner | `runner/` (Node service, web-app rules for code; not deployed to Vercel) | An always-on cloud worker first, and a studio workstation from Layer 3 | Connects out to the record and pulls tasks. It opens no inbound ports |
| Extensions: adapters, steps, checks | `extensions/` | Loaded by the runner | Through the runner only (decision-extensions-and-adapters) |
| Shared schemas: API, events, show package, extension messages | `contracts/` | Build time | Read by every sub-project |
| Editor plugin and show runtime plugin | `unreal/` (unreal-plugin), from Layer 2 | Workstations and show machines | The editor plugin uses the record API. The runtime plugin reads only the show package |

Pipeline code lives in one repository, as rfr-process expects for mixed sub-projects. Each production's Unreal content lives in its own repository with Git LFS and file locking, as the research note recommends for a small team. That content is not stored in this repository. Git LFS with file locking is the approver's decision for show content (2026-11-12).

## Consequences

- The record's HTTP API is the boundary every other part depends on, including Unreal clients later. It is versioned (`/v1`) and described in `contracts/`, and changing it is hard. Internal layout behind it stays cheap to change.
- Long work (agent tasks, generation, backups) never runs inside a web request. It runs in the runner or a scheduled job.
- AGENTS.md has to record which folder uses which rfr profile (`/rfr-process:setup mixed`). That is outside this note.
- Revisit if the data region rules out the chosen provider (decision-project-record-model), if a venue needs the dashboard with no internet, or if the team grows to need Perforce for content.
