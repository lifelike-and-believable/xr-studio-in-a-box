---
id: story-credits-and-outreach-collect-audience-data
status: approved
derived-from:
  - epic-credits-and-outreach#outcome: 0f5f6bfb915f
  - persona-producer#goals: d1cc47b03be9
---

# Collect attendance and feedback by session, where consent allows

As Jordan, the producer, I want attendance and feedback gathered by session where guests' consent allows so that funder and partner reports can be drafted from the record, then checked and sent.

## Acceptance criteria

- Attendance is the number of guests in each session by audience type, counted from the number of guests logged for each session (story-session-operations-reset-for-next-session, story-session-operations-several-sessions) and the join log's counts (story-remote-guests-join-by-link-or-code). Feedback is what a guest chooses to say about a session. This story defines attendance and feedback. Audience data is attendance, feedback and analytics (story-credits-and-outreach-player-page-analytics). Other stories refer to attendance, feedback and audience data by this story's id. Counts identify no one and hold no guest data. Stream platform figures are used only as the platform's terms allow, as checked before going live (story-outputs-and-streaming-approve-going-live).
- What feedback a show gathers is part of its data declaration (story-guest-care-guest-data), approved by the holder of the audience-facing safety and consent approval, and shown to guests in the pre-show notices (story-guest-care-notices-and-warnings). An agent can draft it but cannot approve it.
- Feedback is given only by a guest who chooses to. It is kept with its session and holds no name, contact or device identifier. Jamie chooses whether their words may be quoted in reports, which is off unless they turn it on. In a show that admits minors, a guest under the age of consent gives feedback only with a guardian's consent.
- When Jamie gives feedback, they are shown a code that finds that response but not them. On request with the code, the holder or a person they name deletes it, and the deletion is logged without the data. A deleted response is left out of every later report. Reports already sent stay as sent business records (story-contracts-and-payment-keep-records), with the quote removed only where Jamie asked before the report was sent. Feedback is kept for the period the declaration sets, and is kept out of project backups, so a restore cannot bring it back (story-project-record-back-up-and-restore).
- Until the holder records the legal review for the show's region (story-guest-care-guest-data), feedback runs only in tests with crew who know about it. Gathering never affects the show: it works with every agent and the internet disconnected, and data is sent on later.
- The story is tested with simulated guests over several sessions and copies: counts by audience type are checked against the session and join logs, feedback from a guest who did not opt in and from a simulated minor with no guardian's consent is checked to be blocked, and a response is deleted by its code and checked to be gone from a new report and from a restored backup.
