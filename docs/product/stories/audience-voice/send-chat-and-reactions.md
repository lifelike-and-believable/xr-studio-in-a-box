---
id: story-audience-voice-send-chat-and-reactions
status: approved
derived-from:
  - epic-audience-voice#outcome: f83d52994def
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Send text and reactions to the performer, the scene or both

As Jamie, the audience member, I want to send text and reactions during a show so that my reactions reach the performers.

## Acceptance criteria

- Jamie can send text, and reactions from a set the show declares, from whichever way they join: in the world, on the show's player page, or through a stream platform's chat (story-outputs-and-streaming-read-chat). Jamie sees their own reaction at once on their own screen. Reactions made in the world through an avatar come from story-audience-avatars-react and are handled in the same way.
- For each kind of input, the show sets where it goes: to the performer, to the scene, or to both. Reactions reach the scene through the combined reaction (story-audience-voice-audience-summary) and a signal mapping (story-live-signals-audience-reaction). The director or their delegate sets this in production mode (story-show-safety-switch-modes). In show mode a change follows story-session-operations-live-changes. An agent cannot set or change it.
- Nothing Jamie sends reaches a performer, the scene, an output or other guests except through the show's approved moderation rules (story-audience-voice-moderation-rules).
- Text that reaches Kai is shown where Kai can see it while performing, as the show sets, and can also be read aloud, so it does not rely on sight alone. Text is kept only as long as story-outputs-and-streaming-read-chat allows, and where minors may attend, within the limits set in story-guest-care-guest-data.
- If input arrives in a burst at a rate the director or their delegate sets for the test, the show carries on and the performer loop stays within the show's delay target (story-live-puppet-measure-delay) (REQ-audience-15).
- The story is tested with simulated guests sending text and reactions at set rates, and once in a rehearsal with real guests on the player page.
