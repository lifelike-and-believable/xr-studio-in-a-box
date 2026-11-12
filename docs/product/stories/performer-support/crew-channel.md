---
id: story-performer-support-crew-channel
status: approved
derived-from:
  - epic-performer-support#outcome: c9b11fc41292
  - persona-performer#goals: 72110c93fc2a
---

# Talk privately with the crew

As Kai, the performer, I want to talk privately with the crew by voice and text from inside a headset or suit so that I can hear about a problem without breaking the performance.

## Acceptance criteria

- Kai, Casey and the other cast and crew named for the session can talk by voice and send text during a session. Kai can do both from inside a headset or a suit, without a keyboard.
- Nothing on the channel relies on sound or sight alone: text reaches each person as text and read aloud, and voice is shown as captions to anyone who chooses them, Kai and crew alike.
- What a performer in a suit with no headset can see and hear is found in a test with a real performer in that setup, who sets the bar for following the channel while performing before the story is accepted. The other stories in this epic use what this test finds.
- The channel works on the venue network with the internet off. A remote helper and a venue intercom are separate stories.
- Guests never hear the channel, and it reaches no output. This is checked on every output connected in the test.
- The channel is not recorded unless everyone on it has agreed, and everyone on it can see or hear whether it is being recorded.
- Each automatic message on the channel has one of three priorities. Interrupt: read to the performer at once, for the emergency stop, a fallback or drop on their own channel, and a time-in-kit limit reached (story-schedule-and-touring-time-in-kit). Wait: held for the performer until an offstage moment marked in the cue list (story-cue-list-build-a-cue-list) or a pause, then read, for messages such as a mode switch, a live change or a time-in-kit warning. Crew only: never read to the performer. The director or their delegate sets each message's priority with the performer, in production mode, starting from these, and an agent cannot change it. A held message is shown in text to the crew at once, and Kai can ask for held messages at any time without a keyboard.
