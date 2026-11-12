---
id: story-credits-and-outreach-player-page-analytics
status: approved
derived-from:
  - epic-credits-and-outreach#outcome: 0f5f6bfb915f
  - persona-producer#goals: d1cc47b03be9
---

# Collect analytics on the player page only with consent

As Jordan, the producer, I want analytics on the player page collected only from guests who consent, with no identifiers, so that funder and partner reports can use them and are drafted from the record, then checked and sent.

## Acceptance criteria

- Analytics are measures of how a player guest (story-remote-guests-player-guest) uses the player page beyond the counts in story-credits-and-outreach-collect-audience-data, such as how long they watched, when they left and which actions of the input layer they used. Tracking is anything that links one guest's use of the page over time, such as a code kept in the guest's browser. This story defines analytics and tracking, and adds analytics to the audience data defined in story-credits-and-outreach-collect-audience-data. Other stories refer to them by this story's id. Which analytics a show gathers, and for how long they are kept, is part of its data declaration (story-guest-care-guest-data), approved by the holder of the audience-facing safety and consent approval. An agent can draft it but cannot approve it. The pipeline gathers analytics itself and sends them to no third party.
- Analytics and tracking are off by default. They start for a guest only when Jamie turns them on in the pre-show notices (story-guest-care-notices-and-warnings), as a separate choice from any other consent. A guest who says no, or makes no choice, gets the same show and player page, and nothing beyond the counts is gathered about them. Jamie can turn them off at any time on the player page, and gathering stops at once. In a show that admits minors, a guest under the age of consent is included only with a guardian's consent (story-guest-care-guest-data).
- Analytics hold no name, contact, device identifier or network address. A tracking code is made at random for one show and is not linked to the guest's link or code (story-remote-guests-join-by-link-or-code), chat or feedback. Analytics are kept for the period the declaration sets and are kept out of project backups (story-project-record-back-up-and-restore). Only people whose role needs them see analytics (REQ-workflow-17). Reports and an agent drafting them use combined figures only (story-credits-and-outreach-audience-data-in-reports).
- When Jamie turns analytics on, they are shown a code that finds their analytics but not them. On request with the code, the holder or a person they name deletes them, and the deletion is logged without the data. Deleted analytics are left out of every later report. Reports already sent stay as sent business records (story-contracts-and-payment-keep-records).
- Until the holder records the legal review of guest data for the show's region (story-guest-care-guest-data), analytics and tracking run only in tests with crew who know about it. An agent cannot record it. Gathering never affects the show: if it fails, the player page keeps playing and taking input as before.
- The story is tested with simulated player guests on a private stream only the crew can see: a guest who does not opt in is checked to have no analytics and no tracking code, a simulated minor with no guardian's consent is checked to be left out, a guest who turns analytics off is checked to stop being counted at once, the stored analytics are searched for names, contacts, device identifiers and network addresses and none is found, analytics deleted by their code are checked to be gone from a new report and from a restored backup, and stopping the gathering is checked not to affect the page.
