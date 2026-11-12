---
id: story-performer-support-remote-helper
status: approved
derived-from:
  - epic-performer-support#outcome: c9b11fc41292
  - persona-performer#goals: 72110c93fc2a
---

# Let a remote helper join the crew channel

As Kai, the performer, I want a helper in another location to join the crew channel over the internet so that I can hear about a problem without breaking the performance, even when the helper is not at the venue.

## Acceptance criteria

- Casey names a remote helper for the session from people already on the project with a role (story-project-record-add-person), and only a named helper can join. The helper can talk by voice and send text on the crew channel (story-performer-support-crew-channel), with text read aloud and voice shown as captions to anyone who chooses them, as on the rest of the channel. An agent cannot name a helper.
- The helper hears and sees only the crew channel, whether it is being recorded, and the delay reading below. Nothing else of the show or project is open to them through this link.
- The show never needs the helper. When the helper's link is cut, or the internet is off, the crew channel keeps working for everyone at the venue and the show runs on. Everyone on the channel is told in text and with a sound when the helper's link drops or returns.
- The crew channel's rules apply to the helper too: guests never hear the channel, it reaches no output, and it is not recorded unless everyone on it, the helper included, has agreed.
- The delay between the venue and the helper is measured and shown to the helper and to Casey.
- The story is tested over a simulated internet link with a delay and loss that Casey sets, and once with a helper joining over a real internet connection, as UC-2 is to be tested with a remote helper from the start.
