---
id: story-session-operations-reset-for-next-session
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Reset for the next session, and signal that the show is ready

As Taylor, the venue attendant, I want the show to reset between sessions and tell me when it is ready so that I can get each group of guests through it on time.

## Acceptance criteria

- At the end of a session, the world, characters and cue position return to their starting state, either by one control or automatically, as the director or their delegate sets in production mode. Any guest data the show declares as kept for the session only is deleted under its rules (REQ-governance-7), and none is found after the reset. Then the shorter check runs (story-session-operations-pre-show-check).
- While a reset runs, any guest still in a headset or in front of an output sees a held view or a holding scene that the director or their delegate declares for the show. The person who holds the audience-facing safety and consent approval (story-project-record-name-approvers) approves it with the show's safety rules. An agent cannot approve it.
- When the reset and check pass, Taylor is told in plain language that the show is ready, in text and with a sound. If they fail, Taylor is told what to do next in plain words. The show can also send a one-way ready signal to a venue's own system or staff, as a one-way message (story-external-systems-osc-midi-msc).
- The time from the end of a session to the ready signal is measured in rehearsal. The director or their delegate sets the target from those results before this story is accepted. Each reset then shows its time and pass or fail against the target in text.
- Each session is logged with its start, end and reset time, and no guest data, so reports can count them.
- A reset works with every agent and the internet disconnected. In show mode an agent cannot start one. It is tested in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated guests (story-live-signals-guest-presence).
