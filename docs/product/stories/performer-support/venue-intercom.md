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

- Sam, or another person with the technical artist's role, can connect a venue intercom to the crew channel (story-performer-support-crew-channel) through an adapter, with no change to the core. An agent cannot connect it or change it, and in show mode a change follows the rules for changes during a live run.
- An intercom channel can join only after Casey confirms that it is crew-only and lists every place it reaches, including any paging or wall stations. Everyone on a joined intercom channel counts as named for the session.
- People on the intercom and people on the crew channel hear each other both ways. Voice from the intercom is shown as captions to anyone on the crew channel who chooses them, and text sent on the crew channel is read aloud on the intercom. Where the intercom has a call light or display, a read-aloud message also lights it. Where it has neither, Casey records that its users get crew text by sound only, as an exception to the crew channel's rule.
- The crew channel's rules hold with the intercom connected: guests never hear it and it reaches no output, checked on every output connected in the test and every place Casey listed. While the intercom is connected, the crew channel is not recorded unless Casey records the agreement of everyone on the joined intercom channels.
- The connection works on the venue network with the internet off. If the intercom drops, the crew channel carries on, and everyone on it is told in text and with a sound.
- The adapter can be tested against a simulated intercom or recorded intercom audio when none is present, and with one real intercom the project chooses before the story is accepted. The delay between the intercom and the crew channel is measured and shown.
