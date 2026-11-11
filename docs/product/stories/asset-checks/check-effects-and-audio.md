---
id: story-asset-checks-check-effects-and-audio
status: approved
derived-from:
  - epic-asset-checks#outcome: 85507973a80b
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Check effect cost and audio format and loudness

As Sam, the technical artist, I want effects checked for cost and audio checked for format and loudness on each target before review so that I can see why a check failed and fix the cause once for every project.

## Acceptance criteria

- Before an effect goes to review, its cost is measured against each target's budget file (story-asset-checks-check-against-budget), in the editor or on the test device that the budget file names. The result shows the measures the budget file names, such as particle count and GPU time, with the limit for each target.
- Measuring the same effect twice on the same test device gives results within a tolerance Sam sets. A measurement outside the tolerance is reported as unreliable, not as a pass.
- Before an audio asset goes to review, including stems brought in from a sound designer's audio workstation, it is checked for format (file type, sample rate and channels) and loudness (integrated loudness and true peak) against the values in each target's budget file.
- Effect and audio results count towards whether an asset passes the asset checks for a target, as defined in story-asset-checks-check-against-budget.
- A failed effect or audio check names the check, the target, the measured value and the limit, in plain words. Sam can change the check without modifying the core (story-agent-work-extend-the-workflow).
