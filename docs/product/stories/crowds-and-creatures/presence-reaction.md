---
id: story-crowds-and-creatures-presence-reaction
status: approved
derived-from:
  - epic-crowds-and-creatures#outcome: 07b3a730e1a2
  - persona-director#goals: a92ca172be83
---

# React to a nearby presence, with nothing kept

As Morgan, the director, I want crowds and creatures to react to a nearby guest with non-verbal, rule-based behaviour so that I can take a brief to a running, tested show whose world notices its guests, without rebuilding the reactions for each production.

## Acceptance criteria

- A crowd (story-crowds-and-creatures-place-a-crowd) or creature (story-crowds-and-creatures-add-creatures) can react to a nearby presence reported by floor pads, beams or depth sensors (story-live-signals-guest-presence, story-live-signals-beams, story-live-signals-depth-sensors) through a signal mapping (story-live-signals-map-a-signal). Reactions are non-verbal and rule-based, such as turning toward a presence, keeping a distance or gathering. Sam, or another person with the technical artist's role, sets them in production mode (story-show-safety-switch-modes), within the behaviour specification and content limits (epic-behaviour-and-limits). An agent cannot set them or change them in show mode.
- Nothing about a presence is kept or identified. A reaction uses only momentary presence values. No crowd member or creature follows one guest for longer than the sensor's tracking id lasts (story-live-signals-depth-sensors), and after a session no presence data is found in the project, its recordings or its logs.
- Reactions never respond to identified guests, to guest avatars or to speech (REQ-characters-9). Nothing in the reaction set offers them.
- If the presence signal drops (story-handover-and-fallback-automatic-switch), the reaction uses its fallback (story-handover-and-fallback-define-fallback).
- Presence reaction is used with guests only once each sensor it uses may be switched on for the show, as that sensor's story says, including the notice and the legal review of sensing (REQ-governance-7) recorded by a person who holds the audience-facing safety and consent approval. Until then it is used only in tests with crew who know about it.
- The story is tested with the simulated crowd (story-live-signals-guest-presence) driving a proxy crowd and proxy creatures, with every agent and the internet disconnected, on the budget file's test device (story-asset-checks-check-against-budget).
