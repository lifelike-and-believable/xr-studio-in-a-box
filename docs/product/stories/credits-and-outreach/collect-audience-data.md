---
id: story-credits-and-outreach-collect-audience-data
status: approved
derived-from:
  - epic-credits-and-outreach#outcome: 0f5f6bfb915f
  - persona-producer#goals: d1cc47b03be9
---

# Collect attendance, feedback and analytics by session, where consent allows

As Jordan, the producer, I want attendance, feedback and analytics gathered by session where guests' consent allows so that funder and partner reports can be drafted from the record, then checked and sent.

## Acceptance criteria

- Attendance is counted per session from the session log (story-session-operations-reset-for-next-session, story-session-operations-several-sessions) and the join log's counts (story-remote-guests-join-by-link-or-code), by audience type. Counts identify no one and hold no guest data.
- What feedback and analytics a show gathers is part of its data declaration (story-guest-care-guest-data), approved by the holder of the audience-facing safety and consent approval, and shown to guests in the pre-show notices (story-guest-care-notices-and-warnings). An agent can draft it but cannot approve it.
- Feedback is given only by a guest who chooses to. It is kept with its session and holds no name, contact or device identifier. Jamie chooses whether their words may be quoted in reports, which is off unless they turn it on. Analytics on the player page beyond counts, and any tracking, run only for a guest who consents in the pre-show, and are off by default. In a show that admits minors, a guest under the age of consent gives feedback only with a guardian's consent. Stream platform figures are used only as the platform's terms allow, as checked before going live (story-outputs-and-streaming-approve-going-live).
- When Jamie gives feedback, they are shown a code that finds that response but not them. On request with the code, the holder or a person they name deletes it, and the deletion is logged without the data. Feedback is kept for the period the declaration sets.
- Until the holder records the legal review for the show's region (story-guest-care-guest-data), feedback and analytics beyond counts run only in tests with crew who know about it. Gathering never affects the show: it works with every agent and the internet disconnected, and data is sent on later.
- The story is tested with simulated guests over several sessions and copies: counts are checked against the session and join logs, feedback from a guest who did not opt in and tracking without consent are checked to be blocked, and a response is deleted by its code.
