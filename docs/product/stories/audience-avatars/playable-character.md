---
id: story-audience-avatars-playable-character
status: approved
derived-from:
  - epic-audience-avatars#outcome: 5457b095ba74
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Design a playable character for guests

As Quinn, the interaction designer, I want to design a playable character that guests can play, with its own form, movement and abilities, so that what a guest can do and how they move is in a form others can review.

## Acceptance criteria

- A playable character is an avatar designed as part of the show, of any kind, with its own form, movement and abilities (REQ-audience-2). It follows the rules for a chosen avatar (story-audience-avatars-choose-an-avatar), so it has no likeness of the guest. Its form is made through the character path and passes its gates (story-character-path-design-drafts, story-character-path-mesh-and-rig), on the common skeleton or with an approved mapping asset (story-shared-characters-map-a-different-body).
- Quinn records what the playable character can do and how it moves in the interaction design (story-interaction-design-record-design), mapped to each target's input (story-interaction-design-input-per-target) and movement (story-interaction-design-guest-movement), without code. The design goes through the interaction design gate. An agent can draft it but cannot accept it.
- Quinn can try the playable character in a prototype with placeholder art and simulated guests (story-interaction-design-playable-prototype) before its final form exists.
- An ability that fires a cue uses story-cue-list-audience-fired. Anything one guest's character can do to another follows the show's moderation rules (story-audience-voice-moderation-rules) and personal space (story-audience-voice-personal-space).
- The playable character fits each target's budget file at the guest counts the show declares (story-audience-avatars-choose-an-avatar): it is measured with that many simulated guests playing it, in the Unreal Editor run as a standalone game on the test device and on the delivered build (story-build-and-install-measure-against-budget). A measure over its limit is shown to Quinn and Sam in text, with the measure and the limit.
