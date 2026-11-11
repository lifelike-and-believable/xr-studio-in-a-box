---
id: story-shared-characters-map-a-different-body
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Map a performer's body parts onto a different body

As Sam, the technical artist, I want to map chosen performer body parts onto a character whose body does not match the performer's so that I can set up capture mappings for characters whose bodies do not match.

## Acceptance criteria

- Sam can choose which performer body parts drive which character parts (mapped puppeteering), without code. It is tested on a proxy character with a different body, such as a simple creature built outside the generation path.
- A mapping is a saved asset that names the performer it is for, the performer parts or values, the character parts or values, and who made it. Every mapping asset, including signal mappings (story-live-signals-map-a-signal), follows the rules in this story. Other stories refer to it by this story's id.
- A mapping is versioned with a dated history, and an earlier version can be restored. It goes to the review queue like other work (story-review-and-status-see-review-queue), and can be rehearsed live and reused on another character with the same body.
- Sam, or another person with the technical artist's role, can change a mapping in production mode. An agent can draft or change a mapping but cannot approve it.
- Only an approved mapping runs in show mode. In show mode (story-show-safety-switch-modes), only a person at the show whose role allows it can change a mapping, following story-session-operations-live-changes, and the change needs a new approval. An agent cannot change it in show mode.
