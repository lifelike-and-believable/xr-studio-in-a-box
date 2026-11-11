---
id: story-sound-path-rehearsal-mix-changes
status: approved
derived-from:
  - epic-sound-path#outcome: 3f3e81a83f45
  - persona-sound-designer#goals: 70f155e30dc6
---

# Change levels and mixes in rehearsal without a new build

As Drew, the sound designer, I want to change levels and mixes in rehearsal and save them to the show so that I keep the result without waiting for a new build.

## Acceptance criteria

- During rehearsal in production mode, Drew can change levels and mixes for each output from the operator's position and hear the change at once, with no new build or restart.
- Drew can save the change as a new version of the show's mixes. Earlier versions are kept and can be compared and restored (story-review-and-status-feedback-and-versions).
- A new version runs in show mode only once the person named for the sound and music gate accepts it. An agent cannot accept it.
- In show mode, only a person at the show whose role allows it, such as Alex, the show operator, can ride a level. Changing a mix itself during a live run follows story-session-operations-live-changes. Each change is logged with who made it and when. An agent cannot change a level or a mix in show mode.
- Changes work on the venue network with every agent and the internet disconnected.
