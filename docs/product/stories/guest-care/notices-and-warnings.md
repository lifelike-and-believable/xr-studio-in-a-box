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

- In the pre-show (story-guest-care-standard-pre-show), before entering, every guest is shown the show's notices (what guest data it captures and keeps, story-guest-care-guest-data, and any live room view, venue audio or presence sensing, story-performer-support-room-view, story-performer-support-venue-audio, story-live-signals-guest-presence), its warnings about flashing light, intense motion or distressing content, the access options it offers (story-guest-care-access-options) and its aftercare step (story-guest-care-room-safety). This story defines the warnings before a show starts. Other stories refer to them by this story's id.
- Where the show captures a guest's likeness, voice or body data, Jamie gives or refuses consent for that session before any of it is captured. Keeping it longer is a separate opt-in, which is off unless Jamie turns it on. If Jamie refuses, Jamie is told in plain words what they can still do in the show. Each consent is recorded with the session, and the record is kept (REQ-business-17). No capture starts without it.
- The notices, warnings and consent wording are approved by the holder of the audience-facing safety and consent approval (story-project-record-name-approvers) before any session with guests, and again after each change. An agent can draft them but cannot approve them.
- Notices and warnings are written in plain language, shown as text and read aloud, and offered in each language the show offers (story-guest-care-languages), including a signed version where the show offers a sign-interpreted view.
- The story is tested with simulated guests in headsets and on the player page, checking that no capture starts before consent is recorded and that a guest who refuses still reaches the show as the show declares.
