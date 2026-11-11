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
- A measurement run plays the show from the start to every ending (story-branching-shows-paths-and-endings), with simulated guests (story-live-signals-guest-presence) at the guest counts the show declares (story-venue-setup-fit-check, story-audience-avatars-choose-an-avatar), and recorded performer takes (story-session-recording-record-and-replay) only where each performer's agreement allows replay (story-session-recording-record-agreement), with proxy motion otherwise. Load time is from start to the show ready at its first cue. How frame rate and memory are summarised, such as the slowest one per cent of frames and peak memory, is part of each budget file, set by the director or their delegate (story-asset-checks-check-against-budget). Sam may propose it. An agent cannot set it.
- A show that runs several copies at once (story-session-operations-several-sessions) is also measured with its set number of copies running on the delivered build, and the copy limit fails if any copy goes over its limit.
- The result shows each measure, its limit, the budget file version and pass or fail in text, not by colour alone. A measure over its limit names the cue or section where it went over. A build with any measure over its limit fails its performance measurement.
- Sam can compare each result with the previous build for the same target, and with the measurements made in the editor in Layer 3, and sees the items that changed between the two builds.
- When a budget file changes, the latest build for that target is measured again against the new version.
- The first release's test kit is each budget file's test device, plus the show machines, projectors, headsets and venue network that the director or their delegate chooses and records before the first Layer 5 story is accepted. This story defines the first release's test kit. Other stories refer to it by this story's id. An agent cannot choose or change it.
- The story is tested on a proxy level on each target's test device, and with test builds made to go over each limit in turn.
