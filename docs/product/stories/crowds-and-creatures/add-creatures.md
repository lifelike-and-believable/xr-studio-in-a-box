---
id: story-crowds-and-creatures-add-creatures
status: approved
derived-from:
  - epic-crowds-and-creatures#outcome: 07b3a730e1a2
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Add autonomous creatures that react to cues and performers

As Sam, the technical artist, I want to add autonomous creatures that move and react by rule-based behaviours on the show machine so that a show keeps running when agents and the internet are gone.

## Acceptance criteria

- An autonomous creature is an autonomous character on the common skeleton or on a known body plan (story-nearest-body-retargeting-add-body-plan) that moves by procedural locomotion and reacts by rule-based behaviours. Sam adds autonomous creatures to a scene, chooses their behaviours from a set, such as wander, perch, follow, approach to a distance or flee, and tunes their values without code. Autonomous creature behaviours are rule-based and procedural, as story-crowds-and-creatures-ai-assists defines for Layer 7, and each has a behaviour specification (story-behaviour-and-limits-write-specification), a scripted fallback (story-behaviour-and-limits-scripted-fallback), content limits (story-behaviour-and-limits-content-limits) and override (story-behaviour-and-limits-override). This story defines an autonomous creature. Other stories refer to it by this story's id. A creature style chosen in a character brief (story-character-path-other-styles) is a performer-driven character, not an autonomous creature, and this story's count limit and behaviour specification do not apply to it.
- A cue (story-cue-list-build-a-cue-list) can change an autonomous creature's behaviour or values, and the autonomous creature starts to change within the show's cue timing (story-cue-list-step-and-palette). An autonomous creature reacts to performers' characters by the rules Sam sets, such as following a character or keeping a distance from it.
- The maximum autonomous creature count for each target is measured in a load test on the first release's test kit (story-build-and-install-measure-against-budget) and set by the director or their delegate before this story is accepted. More autonomous creatures than a target's maximum cannot be saved for a show that uses that target, and Sam is told in plain words which target it exceeds.
- Sam tunes autonomous creatures in production mode (story-show-safety-switch-modes). In show mode a change to an autonomous creature is a change during a live run (story-session-operations-live-changes). An agent can draft an autonomous creature's behaviours and values, but cannot set or approve them, or change them in show mode.
- Autonomous creatures run on the show machine with no agent, no internet and no generative model. The scripted test in story-show-safety-without-agents runs with autonomous creatures in the test show, and their behaviour carries on with no stop or visible jump (story-handover-and-fallback-hand-over-a-channel) when every agent stops and the internet is disconnected.
- The story is tested on a proxy level with one autonomous creature on the common skeleton and one on another known body plan, in the Unreal Editor with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated cues and recorded performer takes (story-session-recording-record-and-replay) where each performer's agreement allows replay (story-session-recording-record-agreement).
