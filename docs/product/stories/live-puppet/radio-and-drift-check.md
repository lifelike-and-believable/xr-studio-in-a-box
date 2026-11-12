---
id: story-live-puppet-radio-and-drift-check
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# See radio link quality and drift before they become a drop

As Casey, the capture crew, I want to see each wireless link's quality and each source's drift while I set up and run a session so that I can confirm a performer's data is reaching the right character and channel.

## Acceptance criteria

- For each capture source and microphone on a wireless or radio link, such as the portable inertial suit, a wireless PC VR headset and a radio pack (story-live-puppet-microphone-setup), Casey sees its link quality in text in the crew's tools while it runs: signal strength where the device reports it, lost or late data, and delay. When a link falls below a level Casey sets, Casey and the cast and crew named for the session are told in text and with a sound, before it becomes a drop (story-handover-and-fallback-automatic-switch).
- During setup in a venue, Casey can run a walk test: a performer or Casey walks the performance area while each link is recorded, and the weak spots are shown on the venue's floor plan and saved with the venue profile (story-venue-setup-venue-profile).
- For a source that drifts, such as the portable inertial suit (story-live-puppet-inertial-suit-setup), Casey sees how far the character's position and heading have moved from a reference mark since calibration, as a value in text, and is told in text and with a sound when it passes a tolerance Casey sets. Correcting it follows story-session-operations-live-trim.
- The readings change nothing in what drives a character. Only Casey, the cast and crew named for the session and the show's operator see them. They work with every agent and the internet disconnected.
- The story is tested in a rehearsal room with the portable inertial suit, a radio microphone pack and a wireless PC VR headset. Interference is made by distance and by a second transmitter, and drift by a long take. Casey sets the warning levels and the drift tolerance from this test before the story is accepted.
