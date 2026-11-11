---
id: story-cue-list-audience-fired
status: approved
derived-from:
  - epic-cue-list#outcome: 26d12b7b12dc
  - persona-performer#goals: 9de25c7bbe59
---

# Fire cues from the audience, with a count and an override

As Kai, the performer, I want cues fired by one guest's action or by the combined action of many, counted as the show sets, and to be able to overrule the result, so that I can conduct a crowd while performing.

## Acceptance criteria

- A cue the show allows to be audience-fired (story-cue-list-build-a-cue-list) can fire from one guest's action or from the combined action of many, as the interaction design records it (story-interaction-design-record-design).
- For each combined action, the show sets what counts, its time window and its threshold. The director or their delegate sets them in production mode, and each change makes a new version that names who made it. An agent can draft them but cannot set them, and in show mode a change follows the rules for changes during a live run (story-session-operations-live-changes).
- Audience-fired cues are armed by section (story-cue-list-performer-fired).
- In a live show, Kai or Alex can overrule the result: fire the cue when the threshold is not reached, or block it before it fires. Kai can do this through a gesture or device as in story-cue-list-performer-fired. Kai is told in at least two senses when the result nears the threshold, at a level the director or their delegate sets. Each overrule is logged with who made it.
- No guest action that fires a cue is stored, and no value identifies or follows a single guest outside the moment it fires (story-live-signals-audience-reaction).
- Guest actions come from story-audience-avatars-react and story-remote-guests-player-guest, counted by the audience summary (story-audience-voice-audience-summary) under the moderation rules (story-audience-voice-moderation-rules). Until those stories are built, the story is tested against a simulated audience whose size and actions a person sets. Self-guided experiences belong to epic-branching-shows.
