---
id: story-outputs-and-streaming-read-chat
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Read chat and reactions from whichever destination the show uses

As Sam, the technical artist, I want chat and reactions read from each stream destination the show uses into one feed so that I can add a streaming platform's chat as an integration without modifying the core.

## Acceptance criteria

- Chat messages and reactions from each stream destination the show uses (story-outputs-and-streaming-stream-to-platforms), YouTube Live chat and the player page first, arrive in the show as one feed. Each item is marked with the destination it came from. Reading a destination's chat is part of that destination's integration, so another platform's chat can be added without changing the feed.
- Nothing from the feed reaches a performer, the scene or an output except through moderation rules a person approved (REQ-audience-8), which epic-audience-voice defines. Until those stories exist, the feed reaches only a test view, and is tested with recorded or simulated chat.
- Chat from a public platform is stored and used only as far as that platform's terms and the show's policy record allow, as checked before going live (story-outputs-and-streaming-approve-going-live). Items are kept for no longer than the period the holder of the publishing and marketing approval sets. An agent cannot change that period.
- Only people whose role needs the feed, such as Alex and the person named for moderation, can see it, as far as their role allows (REQ-workflow-17).
- If a destination's chat drops, or a burst of chat arrives at a rate the director or their delegate sets for the test, the show carries on. The performer loop stays within the show's delay target (story-live-puppet-measure-delay) and Alex is told in plain words and by a sound which feed dropped (REQ-audience-15). In show mode, an agent cannot change which destinations feed chat.
