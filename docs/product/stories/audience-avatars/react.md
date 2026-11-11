---
id: story-audience-avatars-react
status: approved
derived-from:
  - epic-audience-avatars#outcome: 5457b095ba74
  - persona-audience-member#goals: e1b5f3ebc15b
---

# React with cheers, gestures, light or sound

As Jamie, the audience member, I want to react with cheers, gestures, light or sound so that my reactions reach the performers.

## Acceptance criteria

- Jamie can send the reactions the show offers, such as cheers, gestures, light or sound responses (REQ-audience-5). Which reactions each target offers, and how each looks and sounds, are recorded in the interaction design (story-interaction-design-record-design) and go through its gate. An interactive guest's reaction shows on their avatar in the world. A player guest's or stream viewer's reaction reaches the show as story-remote-guests-player-guest and story-audience-voice-send-chat-and-reactions say.
- Jamie's own reaction shows at once on their own screen or headset. Other remote guests see it within their tier's delay (story-remote-guests-interactive-guest), and guests in the venue within the show's delay target (story-live-puppet-measure-delay).
- Reactions reach the performers: Kai sees avatars and their reactions in the stage view (story-performer-support-stage-view), and reactions feed the audience summary (story-audience-voice-audience-summary) and the combined reaction (story-live-signals-audience-reaction), so Kai can sense them without watching every avatar.
- Light and sound reactions stay within levels and a rate per guest that the director or their delegate sets in production mode. Light reactions, alone or combined, never flash more than three times in any one second (WCAG 2.3.1), and the holder of the audience-facing safety and consent approval approves the light limits and any stricter limit the show's warnings name (story-guest-care-notices-and-warnings). The test checks the flash rate on each output. A reaction from one guest to another follows the moderation rules (story-audience-voice-moderation-rules) and personal space (story-audience-voice-personal-space). An agent cannot change these limits in show mode.
- For guests in the venue, reactions work with every agent and the internet disconnected.
- No reaction is stored, and no value identifies or follows a single guest outside the moment it is sent (story-live-signals-audience-reaction).
- The story is tested with simulated guests at the show's guest counts (story-audience-avatars-choose-an-avatar), and in one rehearsal with real guests and Kai performing, where Kai records what they noticed.
