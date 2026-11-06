---
id: requirements-interaction
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Interaction design requirements

<!-- Source: the approver's persona review on 2026-11-06. Avatar touch stays in REQ-audience-9, and audience-fired cues are in REQ-showcontrol-10. -->

## REQ-interaction-1: Interaction design stage

Each project can record what a guest can do, how they move and what responds to them, as a reviewable design. It comes before environment building where a project needs it, and ends at a review gate (REQ-workflow-2).

## REQ-interaction-2: Playable prototypes

An interaction can be tried in a playable prototype with placeholder art, before final assets exist. Prototypes can be revised with written feedback (REQ-workflow-3), and a build for one is not gated.

## REQ-interaction-3: Movement

Each experience declares how guests move on each target: physically, by teleport, by smooth movement, or guided or seated. The choices must support the comfort options the show declares (REQ-audience-12).

## REQ-interaction-4: Input across targets

An interaction is designed once and mapped to the input of each target: hand tracking, controllers, mouse and keyboard, and touch. Where a target cannot support an interaction, the design says what replaces it (see REQ-audience-3).

## REQ-interaction-5: Reusable interaction patterns

Common interactions, such as grabbing, using, triggering and following a guide, can be saved to the shared library and reused in new projects (REQ-content-8). A designer can configure a saved pattern without writing code.

## REQ-interaction-6: Interaction tests

Each interaction has a scripted scenario that runs on each target as part of the automatic checks (REQ-workflow-1). Trying it with new guests is a separate step, like a rehearsal.

## REQ-interaction-7: Experiences with no live performer

A self-guided experience is the zero case of a live show: the same authored show, with no performers and no operator. It runs as an app or installation on the first-release targets (REQ-delivery-1). Characters are driven by AI or recordings, and cues fire from guest actions or timecode (REQ-showcontrol-10). It does not need a separate workflow or a separate build path.

With no one running the show, moderation and safety run on rules set beforehand, as in a solo show. A guest or venue attendant can stop the experience and reach its safe state. Avatars touching performers, characters or each other stay in REQ-audience-9.

## Constraints

- Interactions must keep working in show mode with no agent or internet (REQ-workflow-9, REQ-delivery-5).

## Success measures

- Time from an interaction brief to a first playable prototype. The target is set after a baseline is measured on the first project.
- Share of interactions that pass their scripted scenario on every target first time.
