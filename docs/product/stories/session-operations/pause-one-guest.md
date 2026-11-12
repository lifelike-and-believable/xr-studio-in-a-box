---
id: story-session-operations-pause-one-guest
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Pause or end one guest's session

As Taylor, the venue attendant, I want to pause or end one guest's experience while the show goes on for everyone else so that I can pause or stop for a guest who needs help.

## Acceptance criteria

- From the headset list (story-venue-setup-headset-list), Taylor, or another person at the show whose role allows it, can pause one guest. That guest's headset fades to a still comfort view set by the interaction design (story-interaction-design-record-design) with their sound lowered, and their avatar shows as away, as in story-remote-guests-rejoin. Taylor resumes the guest at the show's current point. Pausing one guest never holds the show, which only story-session-operations-pause-and-jump does.
- Taylor can end one guest's session. The guest is told in plain words on their headset, their avatar leaves, and their data is handled as for any guest whose session ends (story-guest-care-guest-data). No other guest, performer or output is held or stopped.
- Each pause, resume and end shows on the headset list in text, is logged with who did it and when, and is shown to Alex on the operator console in text and with a sound.
- In show mode (story-show-safety-switch-modes), only a person at the show whose role allows it can pause, resume or end a guest's session. An agent cannot. A guest in a self-guided show still pauses their own session as story-session-operations-pause-and-jump says.
- Pausing, resuming and ending work with every agent and the internet disconnected.
- The story is tested on the first release's test kit (story-build-and-install-measure-against-budget) with simulated guests in headsets: one guest is paused, resumed and ended while the others are checked to be unaffected. It is also tried once in a rehearsal with real guests.
