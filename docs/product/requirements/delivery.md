---
id: requirements-delivery
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Delivery and deployment requirements

<!-- Source: discovery sections 6, 10, 13. LBVR hardware is undecided. -->

## REQ-delivery-1: First-release targets

The first release delivers to Windows PC (desktop and PC VR, including flat video livestream and projection output) and to browser or mobile stream.

## REQ-delivery-2: One show, scaled

One authored show runs on every supported target, with lower-detail versions for weaker devices (see REQ-content-7). A show is not rebuilt per target.

## REQ-delivery-3: One live source, many outputs

A single live performance feeds several outputs at the same time, including stage projection, in-venue headsets, flat livestream, and browser and mobile clients.

## REQ-delivery-4 (later): Multi-location

Two or more venues can join one shared world, with performers and audience present in it. The first release runs from one location, and the architecture must not prevent this. Performers in distant venues will see each other with a delay, though each performer's own loop still meets REQ-performance-5.

## REQ-delivery-5: Offline

Every function performers, operators and the venue audience need during a show works on the venue network with no internet. Only what reaches remote audiences needs internet and cloud services. If those fail, the show continues in the venue (REQ-audience-15).

## REQ-delivery-6: Staff-installed builds

A technician can install a versioned build on a venue system, check it, and roll back to the previous build.

## REQ-delivery-7: Engine and plugin versions

Each build records the engine and plugin versions it uses. When a target needs a different version from another, the difference is shown and managed rather than found at build time.

## REQ-delivery-8: Performance budgets

Each target has a performance budget (frame rate, memory, load time) set by the approver (TBD). Builds are measured against it automatically.

## REQ-delivery-9 (later): Standalone headsets

Standalone headsets for LBVR are not part of the first release. Content and rigs are built so a standalone or streamed-headset target can be added. The hardware decision depends on the venue and partner (pending).

## REQ-delivery-10 (later): Remote updates and fleet management

Pushing builds to remote venues, monitoring them, and managing fleets of headsets are later. They follow staff-installed builds.

## REQ-delivery-11: Interactive guest access

Interactive guests (REQ-audience-10) on PC and PC VR join through an installed app. Interactive guests on browsers and phones each get a cloud-rendered session of the same show. Each show sets a limit on cloud sessions, and their cost is tracked (REQ-workflow-6). Guests past the limit join as stream viewers.

## REQ-delivery-12: Livestream destinations

Each show sends its flat livestream to public platforms, to its own player page, or to both. Chat and reactions (REQ-audience-8) are read from whichever the show uses. Going live on a public platform needs a person's approval (REQ-workflow-7).

## REQ-delivery-13: Show machine failure

Each show chooses what happens if a main show computer fails: a quick restart that resumes at the last cue, a warm spare machine, or a live spare that takes over at once. The chosen level is tested in rehearsal. Restart and takeover time targets are TBD.

## Constraints

- Unreal Engine is the engine. Plugin and engine version compatibility differs by target and must be checked before a target is chosen.
- Meta's 2026 change to its commercial headset programme and plugin support for the chosen engine version are unchecked (research notes).
- Public platforms apply their own terms, for example on music and chat data. Each show checks them against its policy record (REQ-governance-1).

## Success measures

- A show builds once and runs on each first-release target within its budget.
- A venue with its internet disconnected runs a full show for its venue audience.
- A simulated audience at each release's target counts (REQ-audience-4) connects with the performer loop still inside REQ-performance-5.
