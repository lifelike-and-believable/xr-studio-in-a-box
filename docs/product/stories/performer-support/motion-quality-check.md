---
id: story-performer-support-motion-quality-check
status: approved
derived-from:
  - epic-performer-support#outcome: c9b11fc41292
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Check live motion against the show's bar

As Sam, the technical artist, I want to check live motion against the show's quality bar and correct it where it fails so that the rigs, retargeting and capture mappings I set up hold up when a performer drives them live.

## Acceptance criteria

- Sam can set the show's bar for live motion in numbers: how far limbs may pass through bodies, how far feet may slide, float or sink, and how far a held prop may drift from the hand. The bar and correction settings are versioned and approved at story-review-and-status-motion-quality-gate, and in show mode they change only as a change during a live run (story-session-operations-live-changes).
- During a session, and on a recorded session, Sam can see where and when a proxy character's motion breaks the bar.
- Sam can turn correction on or off for limbs, feet and held props. Correction is built with Unreal's own tools, such as IK Rig and Control Rig. A vendor's tool is considered only if these cannot meet the delay target, and the measurement that shows it is recorded.
- With correction on, the performer's measured delay stays within the show's delay target (story-live-puppet-measure-delay). A correction that would pass it is reported to Sam and not used.
- Correction stays off on a channel with a legibility bar unless the check in story-handover-and-fallback-legibility-bar still passes with it on.
