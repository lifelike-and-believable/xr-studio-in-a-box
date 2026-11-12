---
id: story-guest-care-notices-and-warnings
status: approved
derived-from:
  - epic-guest-care#outcome: 96cd04bf3a39
  - persona-audience-member#goals: e1b5f3ebc15b
---

# See notices, give consent and read warnings before entering

As Jamie, the audience member, I want to see what the show captures, give or refuse consent, and read its warnings before I enter so that I know what is captured about me and can say no.

## Acceptance criteria

- In the pre-show (story-guest-care-standard-pre-show), before entering, every guest is shown the show's notices: what guest data it captures and keeps, and the feedback and analytics it gathers (story-guest-care-guest-data, story-credits-and-outreach-collect-audience-data), and each live use the show declares that an approved story requires a notice for, including a live room view (story-performer-support-room-view), venue audio (story-performer-support-venue-audio), presence sensing (story-live-signals-guest-presence, story-unattended-running-idle-state), depth sensors (story-live-signals-depth-sensors), hand and body tracking (story-audience-avatars-follow-best-input) and the attendants' live view of a guest's headset (story-venue-setup-headset-list). The pre-show also shows its warnings about flashing light, intense motion or distressing content, the access options it offers (story-guest-care-access-options) and its aftercare step (story-guest-care-room-safety). This story defines the notices, guest consent and the warnings before a show starts. Other stories refer to them by this story's id.
- In a show that admits guests under the age of consent (story-guest-care-guest-data), the pre-show asks each guest's age group before any consent step, and a guest under that age is routed to guardian consent. No capture starts for them without it.
- Where the show captures a guest's likeness, voice or body data, Jamie gives or refuses consent for that session before any of it is captured. Keeping it longer is a separate opt-in, which is off unless Jamie turns it on. If Jamie refuses, Jamie is told in plain words what they can still do in the show. Each consent is recorded with the session, and the record is kept as a business record (REQ-business-17, story-contracts-and-payment-keep-records). No capture starts without it.
- The notices, warnings and consent wording are approved by the holder of the audience-facing safety and consent approval (story-project-record-name-approvers) before any session with guests, and again after each change. An agent can draft them but cannot approve them.
- Notices and warnings are written in plain language, shown as text and read aloud, and offered in each language the show offers (story-guest-care-languages), including a signed version where the show offers a sign-interpreted view.
- The notices, consent and warnings work for guests in the venue with every agent and the internet disconnected.
- The story is tested with simulated guests in headsets and on the player page, checking that no capture starts before consent is recorded and that a guest who refuses still reaches the show as the show declares.
