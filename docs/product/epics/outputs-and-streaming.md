---
id: epic-outputs-and-streaming
status: approved
derived-from:
  - requirements-delivery#REQ-delivery-1: d7c254ac22b3
  - requirements-delivery#REQ-delivery-3: 5fd7ae36ca76
  - requirements-delivery#REQ-delivery-12: 5b61046913e7
  - requirements-delivery#REQ-delivery-17: 29dd1b649324
  - persona-show-operator#goals: 408315e4f8f6
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
---

# One live performance, many outputs

<!-- Layer 5, delivery. -->

## Outcome

A single live performance feeds projection, headsets, a flat livestream and browser and mobile clients at once, on several surfaces where a show needs them.

## Personas

- persona-show-operator: runs all outputs from one show.
- persona-technical-artist: connects Unreal's display tools or a venue's media server.
- persona-producer: gets a person's approval before going live.

## Proposed stories

- Send a flat livestream to a public platform, the show's own player page, or both.
- Read chat and reactions from whichever the show uses.
- Output to PC VR, including wireless PC VR.
- Output to a projector or screen.
- Output to several surfaces through Unreal's display tools or a media server.
- Approve going live on a public platform.

## Stories

- story-outputs-and-streaming-stream-to-platforms
- story-outputs-and-streaming-read-chat
- story-outputs-and-streaming-pc-vr
- story-outputs-and-streaming-projector-or-screen
- story-outputs-and-streaming-several-surfaces
- story-outputs-and-streaming-approve-going-live

## Release groups

- The flat livestream and its approval ship first: the first proof is a livestreamed show.
- Projection and PC VR follow.
- Multi-surface output ships when a show needs it.

## Dependencies

- epic-build-and-install.
- epic-live-puppet.
- epic-provenance-and-policy, for the policy record that a platform's terms are checked against.
- epic-external-systems, for sending video to a venue's media server.

## Open questions

- Answered: settled in story-outputs-and-streaming-several-surfaces by a trial on a blended projection setup, recorded by Sam with the engine version, whose picture the director or their delegate accepts or rejects. Where Unreal's display tools do not cover a dome or blended projection, the show sends video to the venue's media server. The trial is run again when the engine version changes.
- Answered: YouTube Live comes first, alongside the show's own player page (story-outputs-and-streaming-stream-to-platforms). Its terms on music and chat data are checked against the policy record before the first public stream (story-outputs-and-streaming-approve-going-live).

## Out of scope

- Broadcast compositing (REQ-delivery-18), native mobile and AR (REQ-delivery-16), which are later.
