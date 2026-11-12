---
id: story-guest-care-guest-data
status: approved
derived-from:
  - epic-guest-care#outcome: 96cd04bf3a39
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Declare what guest data is kept, delete it, and record guardian consent

As Jamie, the audience member, I want each show to declare what it keeps about me, delete it when the session ends, and ask a guardian where minors may attend so that I know what is captured about me and can say no.

## Acceptance criteria

- Each show declares what guest likeness, voice or body data it captures, what it keeps, for how long, and where it is processed. By default it is used live only and deleted when the session ends. The declaration also says what feedback and analytics the show gathers and for how long they are kept (story-credits-and-outreach-collect-audience-data, story-credits-and-outreach-player-page-analytics). The holder of the audience-facing safety and consent approval approves the declaration and each change. An agent can draft it but cannot approve it.
- Data kept for the session only is deleted at the session's end (story-session-operations-reset-for-next-session), and none is found after it in the project, its recordings or its backups (story-project-record-back-up-and-restore). Data kept longer needs the guest's separate opt-in (story-guest-care-notices-and-warnings). On a guest's request, the holder, or a person they name, deletes that guest's kept data, and the deletion is logged without the data. The consent record itself is kept as a business record (REQ-business-17, story-contracts-and-payment-keep-records).
- Each show declares whether guests under the age of consent may attend. Where they may, a guardian's consent is recorded before any likeness, voice or body data is captured, for a guest joining remotely by the guardian's attestation in the pre-show (story-guest-care-notices-and-warnings), and for a guest in the venue by a guardian present at the pre-show, recorded by staff such as Taylor against the guest's session label, and the show sets limits on chat, applied through its moderation rules (story-audience-voice-moderation-rules), and on what is kept.
- The holder records the legal review of guest data (REQ-governance-7) for each region separately. Until it is recorded for the show's region, the capture of guest likeness, voice or body data, and shows that admit minors, run only in tests with crew who know about it. No minor is admitted remotely from a region whose review is not recorded. An agent cannot record a review.
- The story is tested with simulated guest data: a session runs and ends, and the project, recordings and backups are searched for it; capture without consent, or without a guardian's consent for a simulated guest who gives an age group under the age of consent in the pre-show (story-guest-care-notices-and-warnings), is checked to be blocked.
