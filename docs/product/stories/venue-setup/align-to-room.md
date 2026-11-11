---
id: story-venue-setup-align-to-room
status: approved
derived-from:
  - epic-venue-setup#outcome: a0070cbdbc62
  - persona-capture-crew#goals: a63bac7ade3c
---

# Align the virtual world with a room or stage, and save it for that venue

As Casey, the capture crew, I want a guided step that aligns the virtual world with the room or stage and saves the result for that venue so that each headset and capture source is set up and calibrated through a guided process.

## Acceptance criteria

- Casey aligns the virtual world with the room or stage through a guided step, with no code, by marking at least three of the alignment reference points in the venue profile (story-venue-setup-venue-profile) with a tracked device, such as a headset controller (story-live-puppet-headset-setup). Headsets and tracked capture sources then share one origin, and the headset boundary matches the boundaries in the profile. This story defines venue alignment. Other stories refer to it by this story's id.
- The step shows the error at each point in millimetres beside a tolerance that the director or their delegate sets from rehearsal measurements before this story is accepted. A point over tolerance is shown in text and with a sound, and the alignment cannot be saved for show mode until every point is within tolerance.
- The alignment is saved with the venue profile for each layout (story-venue-setup-fit-check), dated and naming who made it. A show at that venue loads it, and the pre-show check (story-session-operations-pre-show-check) confirms that it is the current one.
- In show mode (story-show-safety-switch-modes) an alignment changes only by a trim (story-session-operations-live-trim). An agent cannot align or change an alignment.
- The story is tested with the first release's test kit (story-build-and-install-measure-against-budget) in a profiled room: the virtual boundary and markers are checked against the real ones at each marked point.
