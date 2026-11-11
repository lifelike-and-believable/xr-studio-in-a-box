---
id: story-handover-and-fallback-legibility-bar
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-performer#goals: 9de25c7bbe59
---

# Keep a channel legible or say so

As Kai, the performer, I want to be told when a channel I rely on for meaning, such as my hands for signing, falls below its quality bar so that I can feel a problem without breaking the performance.

## Acceptance criteria

- A show can set a legibility bar for a channel where accuracy carries meaning, such as hands and face for signing. A channel is legible while it meets its bar. How the bar is measured, and its value, are set in a test with Deaf performers and viewers, who set the bar before the story is accepted.
- In show mode, the bar is changed only by a person at the show, and the change is logged.
- When a channel falls below its bar, including after a fallback or on a lower level of detail, Kai gets the performer signal (story-handover-and-fallback-performer-signal) and a notice appears on the rendered output, in a form the Deaf viewers in the test can read.
- A channel with a legibility bar never fills the gap with AI motion: an AI-held pose cannot be its fallback, and AI secondary motion is off on it while it is below the bar.
- The check runs in rehearsal on a proxy character, and its pass or fail result is recorded.
