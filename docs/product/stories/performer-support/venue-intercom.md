---
id: story-performer-support-venue-intercom
status: approved
derived-from:
  - epic-performer-support#outcome: c9b11fc41292
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Connect a venue intercom to the crew channel

As Sam, the technical artist, I want to connect a venue's own intercom to the crew channel through an adapter so that I can add the integration without modifying the core.

## Acceptance criteria

- Sam can connect a venue intercom to the crew channel (story-performer-support-crew-channel) through an adapter, and choose which intercom channels join it, with no change to the core.
- People on the intercom and people on the crew channel hear each other both ways. Voice from the intercom is shown as captions to anyone on the crew channel who chooses them, and text sent on the crew channel is read aloud on the intercom.
- The crew channel's rules hold with the intercom connected: guests never hear it and it reaches no output, checked on every output connected in the test, and it is not recorded unless everyone on it has agreed.
- The connection works on the venue network with the internet off. If the intercom drops, the crew channel carries on, and everyone on it is told in text and with a sound.
- The adapter can be tested against a simulated intercom or recorded intercom audio when none is present, and with one real intercom the project chooses before the story is accepted. The delay between the intercom and the crew channel is measured and shown.
