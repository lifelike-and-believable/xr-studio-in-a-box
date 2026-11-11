---
id: story-build-and-install-measure-against-budget
status: approved
derived-from:
  - epic-build-and-install#outcome: ac937a2b0f34
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Measure each delivered build against each target's budget

As Sam, the technical artist, I want every delivered build measured automatically for frame rate, memory and load time against each target's budget file so that I can see why a build failed its checks and fix the cause once for every project.

## Acceptance criteria

- Every delivered build (story-build-and-install-build-from-stages) is measured by itself on each target's test device for frame rate, memory and load time (REQ-delivery-8), against the target's current budget file (story-asset-checks-check-against-budget). This story defines measuring a delivered build against the budget. Other stories refer to it by this story's id.
- A measurement run plays the show from the start to every ending (story-branching-shows-paths-and-endings), with simulated guests (story-live-signals-guest-presence) at the guest count the show declares, and recorded performer takes (story-session-recording-record-and-replay) only where each performer's agreement allows replay (story-session-recording-record-agreement), with proxy motion otherwise. Load time is from start to the show ready at its first cue. Sam sets how frame rate and memory are summarised, such as the slowest one per cent of frames and peak memory, in production mode. An agent cannot set it.
- The result shows each measure, its limit, the budget file version and pass or fail in text, not by colour alone. A measure over its limit names the cue or section where it went over. A build with any measure over its limit fails its performance measurement.
- Sam can compare each result with the previous build for the same target, and with the measurements made in the editor in Layer 3, and sees the items that changed between the two builds.
- When a budget file changes, the latest build for that target is measured again against the new version.
- The story is tested on a proxy level on each target's test device, and with test builds made to go over each limit in turn.
