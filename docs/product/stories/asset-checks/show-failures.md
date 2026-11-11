---
id: story-asset-checks-show-failures
status: approved
derived-from:
  - epic-asset-checks#outcome: 85507973a80b
  - persona-artist#goals: 0767918db571
---

# Show check results beside the item

As Riley, the artist, I want check results shown beside my item, for me and for the reviewer, so that I know what is waiting for review and what the reviewer said about it.

## Acceptance criteria

- In the review queue (story-review-and-status-see-review-queue), each item shows its check results beside the preview: passed, or each failed check with its target, measured value and limit, in plain words with no code terms.
- Riley sees the same results beside Riley's own item, with the reviewer's feedback (story-review-and-status-feedback-and-versions), as soon as the checks finish and before the item reaches the reviewer. A failed check on Riley's item counts as something waiting for Riley, and reaches Riley by the channels Riley chose (story-review-and-status-notifications).
- Results are given in text, never by colour or icon alone, and can be read by keyboard and screen reader, meeting WCAG 2.2 AA.
- The reviewer can accept an item with a failed check. The failure stays on the item's record, and the asset does not pass the asset checks for that target (story-asset-checks-check-against-budget) until it is fixed or a lower-detail version passes (story-asset-checks-lower-detail-versions).
- An AI pre-check of the results is marked as a recommendation and cannot pass the gate (story-review-and-status-hold-gated-hand-off).
- Each person sees check results only for items their role allows.
