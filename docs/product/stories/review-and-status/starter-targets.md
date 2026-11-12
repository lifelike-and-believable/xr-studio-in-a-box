---
id: story-review-and-status-starter-targets
status: approved
derived-from:
  - epic-review-and-status#outcome: adfddef70e61
  - persona-director#goals: a92ca172be83
---

# Accept a starter set of targets and limits

As Morgan, the director, I want a starter set of every target and limit the show needs, which I accept in one step and change only where rehearsal shows a need, so that I approve quickly and review does not become the pipeline's limit.

## Acceptance criteria

- The starter set lists every target, limit, tolerance, window, count and timeout that the show's stories leave for a named person to set, such as the delay target (story-live-puppet-measure-delay) or a timeout (story-handover-and-fallback-automatic-switch). Each entry has a proposed first value, the source of that value (a research note, a past show, or a measurement on the test kit, story-build-and-install-measure-against-budget) and the person its story names. This story defines the starter set. Where a story says a person sets a value, including "from rehearsal", the accepted starter value is the first value until that person changes it. An agent may draft entries and their sources, but cannot accept or change an accepted value.
- Morgan, or their delegate, sees the set in the review queue (story-review-and-status-see-review-queue), grouped by area (show, performers, guests, capture, sound, delivery), and can accept all of it in one step, or accept part and leave the rest unset.
- Values that belong to another person are not accepted by Morgan: content limits and audience-facing safety values need the holder of the audience-facing safety and consent approval, and a performer's time-in-kit limit is still set with that performer and confirmed by them (story-schedule-and-touring-time-in-kit). The capture crew's timing values (timeouts, settling times, ease times, trim ranges and the default blend) are proposed per venue, accepted by Casey and saved with the venue profile (story-venue-setup-venue-profile).
- After acceptance, a value changes only through the person its story names. Each change is logged with the old and new value, who changed it, when and why, such as a rehearsal result. In show mode, a change is a change during a live run (story-session-operations-live-changes).
- Every value still unset is listed in plain words, with the story that needs it and who sets it, on the status board (story-review-and-status-status-board) and in the pre-show check (story-session-operations-pre-show-check), where it shows as not ready. The person switching to show mode sees it listed (story-show-safety-switch-modes).
- The story is tested by drafting the set for the first show's (UC-2) stories, accepting it in one step, changing one value after a rehearsal, and leaving one unset to see it listed in the pre-show check. Accepted values are used with every agent and the internet disconnected.
