---
id: story-remote-guests-player-guest
status: approved
derived-from:
  - epic-remote-guests#outcome: b4af335ea8ee
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Join as a player guest, with a light input layer over the stream

As Jamie, the audience member, I want to watch the show on its player page and act through a light input layer so that my reactions and actions reach the performers.

## Acceptance criteria

- Player guests watch the flat livestream on the show's own player page (story-outputs-and-streaming-stream-to-platforms) with a light input layer on top, such as buttons, taps and reactions, as the interaction design sets for touch and mouse (story-interaction-design-record-design, story-interaction-design-input-per-target). There is no rendered session for each guest (REQ-audience-10). This story defines the player tier and its input layer. Other stories refer to them by this story's id.
- Jamie's own action shows at once on their screen. It reaches the show individually or as a combined result, as the director or their delegate sets in production mode for each action. A combined result can fire an audience-fired cue (story-cue-list-audience-fired) and feeds the audience summary (story-audience-voice-audience-summary). An individual action identifies no guest outside the moment it reaches the show. An agent can draft these settings but cannot set them.
- The time from a player's action to its effect, on the stream as they receive it, is measured and shown, with the stream's own delay shown separately.
- The player page plays the stream's mix (story-sound-path-mix-per-output). Text sent from the player page goes through the chat feed and the moderation rules (story-outputs-and-streaming-read-chat, story-audience-voice-moderation-rules).
- UC-2, the livestreamed improvised puppetry show, is the first show with player guests. The tier is designed in the first release and built for UC-2.
- The story is tested with simulated player guests in a load test, from which the director or their delegate sets the show's player guest count (story-audience-avatars-choose-an-avatar), on a private stream only the crew can see, and in one rehearsal with real guests on their own phones and browsers.
