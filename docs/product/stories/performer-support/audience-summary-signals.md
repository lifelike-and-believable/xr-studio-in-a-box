---
id: story-performer-support-audience-summary-signals
status: approved
derived-from:
  - epic-performer-support#outcome: c9b11fc41292
  - persona-performer#goals: 9de25c7bbe59
---

# Sense the audience through physical signals

As Kai, the performer, I want to sense the audience summary through physical signals such as lights so that I can sense the audience without watching hundreds of avatars.

## Acceptance criteria

- Casey can map values of the audience summary, such as presence and reaction level, to physical signals such as lights or a haptic device. The mapping is saved with the show and can be reviewed.
- The signals do not rely on sound or sight alone: a show that uses lights or sound also uses a signal Kai can feel, such as a haptic one.
- Kai can sense a change in the summary without looking at a screen. Until the audience layer exists, this is tested with a simulated audience summary.
- The delay from a change in the summary to the signal is measured and shown.
- If the summary stops arriving, the signals go to a neutral state Casey sets for the show, and Kai gets the performer signal's pattern for a lost audience summary (story-handover-and-fallback-performer-signal).
