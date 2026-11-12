---
id: story-review-and-status-what-needs-me
status: approved
derived-from:
  - epic-review-and-status#outcome: adfddef70e61
  - persona-artist#goals: 0767918db571
---

# See what needs me when I sign in

As Riley, the artist, I want a first view that shows what needs me and what to do next so that I know what is waiting for review, and what the reviewer said.

## Acceptance criteria

- When Riley signs in, the first view lists what needs Riley: items returned for revision, with the reviewer's written feedback (story-review-and-status-feedback-and-versions); items Riley submitted that are waiting, with the gate each waits at; and work assigned to Riley. Each item says its next step in plain words and opens to the item.
- Items are grouped by gate and listed oldest first, and an item that blocks another stage is marked as blocking in text, not by colour alone (story-review-and-status-see-review-queue).
- The view shows only items Riley's role allows (story-project-record-add-person). It is built from the review queue and the status board (story-review-and-status-status-board) and adds no record of its own. The same view is offered to every role, such as Drew and Sam.
- A person new to the project also sees the stages their role works in and the gate each goes to, in plain words. In a test, a person new to the pipeline finds their first task and its gate without help, and that person sets the bar before the story is accepted.
- The view updates when an item moves, without a reload, and meets WCAG 2.2 AA.
