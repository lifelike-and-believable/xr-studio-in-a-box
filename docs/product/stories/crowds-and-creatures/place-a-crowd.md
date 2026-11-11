---
id: story-crowds-and-creatures-place-a-crowd
status: approved
derived-from:
  - epic-crowds-and-creatures#outcome: 07b3a730e1a2
  - persona-director#goals: a92ca172be83
---

# Place a crowd in a scene, and choose and tune its behaviours

As Morgan, the director, I want to place a crowd in a scene and choose and tune its behaviours without code so that I can take a brief to a running, tested show without rebuilding the same crowd for each production.

## Acceptance criteria

- A crowd is a group of autonomous background characters placed in an area of a scene, with a count. Morgan, or their delegate, places a crowd and chooses its behaviours from a set, such as idle, wander, gather at a point, flock, face a point or keep away from a character, and Sam, or another person with the technical artist's role, tunes each behaviour's values, without code. Crowd behaviours are rule-based and procedural, as story-crowds-and-creatures-ai-assists defines for Layer 7, and a crowd is an autonomous character with a behaviour specification (story-behaviour-and-limits-write-specification), a scripted fallback (story-behaviour-and-limits-scripted-fallback), content limits (story-behaviour-and-limits-content-limits) and override (story-behaviour-and-limits-override). This story defines a crowd. Other stories refer to it by this story's id.
- A cue (story-cue-list-build-a-cue-list) can change a crowd's behaviour or its values, and the crowd starts to change within the show's cue timing (story-cue-list-step-and-palette). A crowd can react to performers' characters by the rules Sam sets, such as turning toward a character or parting around it. A crowd's values can also be driven through a signal mapping (story-live-signals-map-a-signal), as the simulated crowd in story-audience-avatars-stream-viewer-crowd needs.
- The maximum crowd count for each target is measured in a load test on the first release's test kit (story-build-and-install-measure-against-budget) and set by the director or their delegate before this story is accepted. A crowd larger than a target's maximum cannot be saved for a show that uses that target, and Morgan is told in plain words which target it exceeds.
- Morgan, or their delegate, and Sam choose and tune crowds in production mode (story-show-safety-switch-modes). In show mode a change to a crowd is a change during a live run (story-session-operations-live-changes). An agent can draft a crowd's behaviours and values, but cannot set or approve them, or change them in show mode.
- A crowd runs on the show machine with no agent, no internet and no generative model, and the scripted test in story-show-safety-without-agents runs with a crowd in the test show.
- The story is tested on a proxy level with proxy characters on the common skeleton, in the Unreal Editor with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated cues and recorded performer takes (story-session-recording-record-and-replay) where each performer's agreement allows replay (story-session-recording-record-agreement).
