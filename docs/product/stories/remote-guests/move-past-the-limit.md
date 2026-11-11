---
id: story-remote-guests-move-past-the-limit
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-producer#goals: d1cc47b03be9
---

# Move guests past the limit to a lower tier

As Jordan, the producer, I want guests past a show's limits moved to a lower tier, and to see what cloud sessions cost, so that spend does not pass the project's limit without someone deciding that it should.

## Acceptance criteria

- Each show has a limit on interactive guests, its guest count (story-audience-avatars-choose-an-avatar), and a limit on cloud sessions (story-remote-guests-interactive-guest, REQ-delivery-11). The director or their delegate sets both in production mode (story-show-safety-switch-modes). An agent cannot set them. In show mode a change to either is a change during a live run (story-session-operations-live-changes).
- A guest who arrives when their tier is full is offered the next tier down, from interactive guest to player guest, and from player guest to stream viewer, in plain words on their screen. They join it without entering their code again or repeating the pre-show. Where the show allows it, a guest moved down is offered a place in the higher tier when one frees, in order of arrival.
- No guest past the limit gets a cloud session or a place in the world. The test checks that neither count is ever passed.
- Jordan sees, for each show and session, the number of cloud sessions, their running time and their cost against the show's budget in the cost view (REQ-workflow-6, epic-budgets-and-cost), and how many guests were moved down. Only people whose role needs it can see this.
- The story is tested with simulated guests arriving past each limit, and checks that each one lands in the tier below and is told why.
