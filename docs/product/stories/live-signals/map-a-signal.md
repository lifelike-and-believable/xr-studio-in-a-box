---
id: story-live-signals-map-a-signal
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Map a signal onto a channel

As Sam, the technical artist, I want to map a signal onto a channel and save the mapping as a reviewable asset so that I can set up and change how a signal drives a character without code.

## Acceptance criteria

- A signal mapping turns a signal value into a channel value. Sam can set the input range, the output range, the curve, the smoothing and limits the channel value never passes, without code. Other live-signals stories use this meaning.
- Sam can rehearse a mapping by playing a recorded or simulated signal through it and watching a proxy character, before the mapping is approved.
- A signal mapping is saved as the same kind of asset as a body mapping in epic-shared-characters: it is versioned with a dated history, goes to the review queue, and an earlier version can be restored.
- Only an approved mapping runs in show mode. A person approves it. An agent can draft or change a mapping but cannot approve it.
- A saved mapping can be reused on another channel or character, and changed later with no rebuild.
